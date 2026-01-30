import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment.js';

export const tokenService = {
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            roleId: user.roleId,
            roleName: user.Role?.name || 'USER'
        }, ENV.jwt.accessTokenSecret, {
            expiresIn: ENV.jwt.accessTokenExpiry,
        });
    },

    generateRefreshToken: (user) => {
        return jwt.sign({ id: user.id }, ENV.jwt.refreshTokenSecret, {
            expiresIn: ENV.jwt.refreshTokenExpiry,
        });
    },

    verifyAccessToken: (token) => {
        try {
            return jwt.verify(token, ENV.jwt.accessTokenSecret);
        } catch (err) {
            return null;
        }
    },

    verifyRefreshToken: (token) => {
        try {
            return jwt.verify(token, ENV.jwt.refreshTokenSecret);
        } catch (err) {
            return null;
        }
    },
};
