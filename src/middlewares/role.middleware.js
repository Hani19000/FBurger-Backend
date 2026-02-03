import { ROLES } from '../constants/roles.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roleName)) {
            return next(
                new AppError('Access denied', HTTP_STATUS.FORBIDDEN)
            );
        }
        next();
    };
};

export const requireAdmin = requireRole(ROLES.ADMIN);
export const requireUser = requireRole(ROLES.USER);
