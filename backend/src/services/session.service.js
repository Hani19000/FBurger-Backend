import { SessionRepository } from '../repositories/postgres/session.repository.js'

export const sessionService = {
    createSession: async (userId, refreshToken) => {
        if (!userId || !refreshToken) throw new Error('Données de session manquantes');
        return await SessionRepository.create({ userId, refreshToken });
    },

    validateSession: async (refreshToken) => {
        if (!refreshToken) return null;
        return await SessionRepository.findByRefreshToken(refreshToken);
    },

    deleteSession: async (refreshToken) => {
        if (!refreshToken) return;
        await SessionRepository.deleteByRefreshToken(refreshToken);
    },

    cleanExpiredSessions: async () => {
        await SessionRepository.deleteExpiredSessions();
    },
};
