import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/appError.js';
import { sessionService } from '../services/session.service.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { User, Role } from '../models/postgres/index.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
};


const ACCESS_TOKEN_OPTIONS = {
    ...COOKIE_OPTIONS,
    maxAge: 30 * 60 * 1000
};

export const register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, HTTP_STATUS.OK, { user });
});

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password);
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, HTTP_STATUS.OK, { user });
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    // 1. Supprimer la session en DB
    if (refreshToken) await authService.logout(refreshToken);

    // 2. Supprimer les cookies côté navigateur (IMPORTANT)
    res.clearCookie('accessToken', ACCESS_TOKEN_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);

    // 3. Répondre au client
    sendSuccess(res, HTTP_STATUS.OK, { message: 'Déconnexion réussie' });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new AppError('Refresh token missing', HTTP_STATUS.UNAUTHORIZED);

    const session = await sessionService.validateSession(refreshToken);
    if (!session) throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    // renvoie le nouveau token dans le cookie !
    res.cookie('accessToken', accessToken, ACCESS_TOKEN_OPTIONS);

    sendSuccess(res, HTTP_STATUS.OK, { message: 'Token rafraîchi' });
});


export const getMe = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        return sendSuccess(res, HTTP_STATUS.OK, { user: null, authenticated: false });
    }
    // req.user contient l'ID grâce au middleware authenticateToken
    const user = await User.findByPk(req.user.id, {
        include: [{ model: Role, as: 'Role' }],
        attributes: { exclude: ['passwordHash', 'salt'] }
    });

    if (!user) throw new AppError('Utilisateur introuvable', HTTP_STATUS.NOT_FOUND);

    sendSuccess(res, HTTP_STATUS.OK, user);
});