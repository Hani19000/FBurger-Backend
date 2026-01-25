import { pgSequelize } from '../src/config/sequelize.js';
import { logger } from '../src/utils/logger.js';

export const initDatabase = async () => {
    try {
        await pgSequelize.sync({ alter: true });
        logger.info('Database tables synchronized');
    } catch (err) {
        logger.error('Database sync failed:', err);
    }
};