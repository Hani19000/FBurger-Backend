import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/appError.js';
import { sessionService } from '../services/session.service.js';
import {HTTP_STATUS} from '../constants/httpStatus.js';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, HTTP_STATUS.CREATED, { user, accessToken });
});

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, HTTP_STATUS.OK, { user, accessToken });
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, maxAge: 0 });
    sendSuccess(res, HTTP_STATUS.OK, { message: 'Logout succesfly' });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new AppError('Refresh token missing', HTTP_STATUS.UNAUTHORIZED);

    const session = await sessionService.validateSession(refreshToken);
    if (!session) throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);

    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, HTTP_STATUS.OK, { accessToken });
});
