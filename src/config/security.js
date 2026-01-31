import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { ENV } from './environment.js';
import { ERRORS } from '../constants/errors.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

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

// Cette fonction garantit que l'on cible l'IP exact du user (car render utilise plusieurs ip)
const getIp = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // retourne la première IP de la liste et on enlève les espaces
        return xForwardedFor.split(',')[0].trim();
    }
    // Fallback sur req.ip si le header est absent
    return req.ip || "unknown";
};

export const generalLimiter = rateLimit({
    windowMs: ENV.rateLimit.windowMs,
    max: ENV.rateLimit.max,
    validate: { ip: false },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => getIp(req)
});

export const authLimiter = rateLimit({
    windowMs: ENV.rateLimit.authWindowMs,
    max: ENV.rateLimit.authMax,
    validate: { ip: false },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => getIp(req),
    handler: (req, res) => {
        const realIp = getIp(req); // recuperation de l'IP une seule fois
        logger.warn(`Tentative de spam détectée depuis l'IP : ${realIp}`);
        res.status(HTTP_STATUS.Too_Many_Requests).json({
            status: 429,
            error: ERRORS.AUTH.TOO_MANY_ATTEMPTS,
            message: "Trop de tentatives, veuillez réessayer plus tard."
        });
    },
});

export const reviewLimiter = rateLimit({
    windowMs: ENV.rateLimit.reviewWindowMs,
    max: ENV.rateLimit.reviewMax,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { ip: false },
    keyGenerator: (req) => getIp(req),
    handler: (req, res) => {
        const realIp = getIp(req);
        logger.warn(`Tentative de spam détectée depuis l'IP : ${realIp}`);
        res.status(HTTP_STATUS.Too_Many_Requests).json({
            status: 429,
            error: ERRORS.AUTH.TOO_MANY_ATTEMPTS,
            message: "Trop de tentatives, veuillez réessayer plus tard."
        });
    },
});