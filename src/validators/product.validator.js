import { body } from 'express-validator';

export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 3, max: 100 }).withMessage('Le nom doit faire entre 3 et 100 caractères'),
    body('categorie')
        .trim()
        .notEmpty().withMessage('La catégorie est requise'),
    body('image_url')
        .optional(),
    body('prix')
        .notEmpty().withMessage('Le prix est requis')
        .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères')
];

export const updateProductValidation = [
    body('name')
        .optional().trim()
        .isLength({ min: 3, max: 100 }),
    body('categorie')
        .optional()
        .trim(),
    body('image_url')
        .optional().
        trim(),
    body('prix')
        .optional()
        .isFloat({ min: 0 }),
    body('description')
        .optional()
        .trim()
];