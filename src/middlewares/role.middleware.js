import { ROLES } from '../constants/roles.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { logger } from '../utils/logger.js';

export const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        // On récupère le rôle de manière sécurisée (fallback sur roleName ou role)
        const currentRole = req.user?.roleName || req.user?.role;

        // Log pour le débuggage en prod (visible sur Render)
        if (process.env.NODE_ENV !== 'production' || !currentRole) {
            logger.info(`Auth Debug - User ID: ${req.user?.id}, Role found: ${currentRole}, Required: ${allowedRoles}`);
        }

        if (!req.user || !currentRole || !allowedRoles.includes(currentRole)) {
            logger.warn(`Access Denied - User ${req.user?.id} has role ${currentRole} but needed ${allowedRoles}`);
            return next(
                new AppError('Access denied', HTTP_STATUS.FORBIDDEN)
            );
        }
        next();
    };
};

export const requireAdmin = requireRole(ROLES.ADMIN);
export const requireUser = requireRole(ROLES.USER);