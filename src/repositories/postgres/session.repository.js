import { Session } from '../../models/postgres/session.model.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/environment.js';
import { Op } from 'sequelize';

export const SessionRepository = {
    create: async ({ userId, refreshToken }) => {
        const expiryMs = parseInt(ENV.jwt.refreshTokenExpiry, 10) * 1000;
        const expiresAt = new Date(Date.now() + expiryMs);

        const session = await Session.create({
            userId,
            refreshToken,
            expiresAt
        });

        return session;
    },

    findByRefreshToken: async (refreshToken) => {
        return await Session.findOne({ where: { refreshToken } });
    },

    deleteByRefreshToken: async (refreshToken) => {
        const session = await Session.findOne({ where: { refreshToken } });
        if (session) await session.destroy();
    },

    findActiveByUserId: async (userId) => {
        return await Session.findAll({
            where: { userId, expiresAt: { [Op.gt]: new Date() } },
        });
    },

    deleteExpiredSessions: async () => {
        await Session.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });
    },
};
