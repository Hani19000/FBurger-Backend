import { param, body } from 'express-validator';
import { ROLES } from '../constants/roles.js';

export const updateRoleValidation = [
    param('userId')
        .isUUID()
        .withMessage('User ID must be a valid UUID'),
    body('roleName')
        .notEmpty().withMessage('Role name is required')
        .isIn(Object.values(ROLES)).withMessage(`Invalid role name. Must be one of: ${Object.values(ROLES).join(', ')}`)
];