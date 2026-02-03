import { tokenService } from '../services/token.service.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticateToken = asyncHandler(async (req, _res, next) => {
    // 1. Extraction (Priorité au cookie pour la sécurité)
    const token = req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (!token) {
        // On arrête tout de suite : pas de token = pas d'accès aux routes protégées
        return next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
    }
    // 2. Vérification
    const payload = tokenService.verifyAccessToken(token);
    if (!payload) {
        return next(new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED));
    }

    // 3. // stocke tout le payload dans req.user
    req.user = {
        id: payload.id,
        roleId: payload.roleId,
        roleName: payload.roleName
    };

    next();
});

export const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roleName)) {
            return next(new AppError('Access denied', HTTP_STATUS.FORBIDDEN));
        }
        next();
    };
};

export const requireAdmin = requireRole('ADMIN');
export const requireUser = requireRole('UTILISATEUR');