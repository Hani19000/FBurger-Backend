import { body } from 'express-validator';

export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    body('image')
        .isURL().withMessage('Please provide a valid image URL'),
    body('price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number')
        .custom(value => Number.isFinite(Number(value)))
        .withMessage('Price must have up to 2 decimal places'),
    body('description')
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters')
];

export const updateProductValidation = [
    body('name')
        .optional().trim()
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    body('categorie')
        .optional().trim(),
    body('image_url')
        .optional()
        .trim(),
    body('prix')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description')
        .optional().trim()
];
