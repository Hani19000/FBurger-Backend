import { body } from 'express-validator';

export const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters long'),

    body('email')
        .trim()
        .normalizeEmail()
        .isEmail().withMessage('Email format is invalid'),

    body('password')
        .isLength({ min: 8, max: 100 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
];

export const loginValidation = [
    body('email').trim().normalizeEmail().isEmail().withMessage('Email format is invalid'),
    body('password').notEmpty().withMessage('Password is required')
];
