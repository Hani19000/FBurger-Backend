import { body } from 'express-validator';

export const createReviewValidation = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('content')
        .trim()
        .notEmpty().withMessage('Review content cannot be empty')
        .isLength({ min: 10, max: 500 }).withMessage('Review must be between 10 and 500 characters long')
];