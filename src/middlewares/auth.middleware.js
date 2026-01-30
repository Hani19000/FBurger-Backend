import { tokenService } from '../services/token.service.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const authenticateToken = async (req, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return next(new AppError('Access token missing', HTTP_STATUS.UNAUTHORIZED));

    const payload = tokenService.verifyAccessToken(token);
    if (!payload) return next(new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED));

    // stocke tout le payload dans req.user
    req.user = {
        id: payload.id,
        roleId: payload.roleId,
        roleName: payload.roleName
    };

    next();
};

export const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roleName)) {
            return next(new AppError('Access denied', HTTP_STATUS.FORBIDDEN));
        }
        next();
    };
};

export const requireAdmin = requireRole('admin');
export const requireUser = requireRole('user');