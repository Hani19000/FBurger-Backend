import { pgSequelize } from '../config/database.js';

export const checkSystemHealth = async () => {
    await pgSequelize.authenticate();

    return {
        status: 'UP',
        database: 'postgres_connected',
        timestamp: new Date().toISOString()
    };
};