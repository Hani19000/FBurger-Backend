import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { ENV } from './environment.js';
import { ERRORS } from '../constants/errors.js';
import { logger } from '../utils/logger.js';

// const origins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];

export const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
});

export const compressionMiddleware = compression();

export const corsMiddleware = cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
});

export const generalLimiter = rateLimit({
    windowMs: ENV.rateLimit.windowMs,
    max: ENV.rateLimit.max,
    keyGenerator: (req) => req.ip || "unknown",
    standardHeaders: true,
    legacyHeaders: false,
    validate: { ip: false }
});

export const authLimiter = rateLimit({
    windowMs: ENV.rateLimit.authWindowMs,
    max: ENV.rateLimit.authMax,
    keyGenerator: (req) => req.ip || "unknown",
    validate: { ip: false },
    handler: (req, res) => {
        logger.warn(`Tentative de spam détectée depuis l'IP : ${req.ip}`);
        res.status(HTTP_STATUS.Too_Many_Requests).json({
            status: 429,
            error: ERRORS.AUTH.TOO_MANY_ATTEMPTS,
            message: "Trop de tentatives, veuillez réessayer plus tard."
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const reviewLimiter = rateLimit({
    windowMs: ENV.rateLimit.reviewWindowMs,
    max: ENV.rateLimit.reviewMax,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || "unknown",
    handler: (req, res) => {
        logger.warn(`Tentative de spam détectée depuis l'IP : ${req.ip}`);
        res.status(HTTP_STATUS.Too_Many_Requests).json({
            status: 429,
            error: ERRORS.AUTH.TOO_MANY_ATTEMPTS,
            message: "Trop de tentatives, veuillez réessayer plus tard."
        });
    },
});