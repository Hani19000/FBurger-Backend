import mongoose from 'mongoose';
import { logger } from './logger.js';

export const checkPostgres = async (pgPool) => {
  try {
    await pgPool.query('SELECT 1');
    return { status: 'up' };
  } catch (err) {
    logger.error('PostgreSQL healthcheck failed', err);
    return { status: 'down', error: err.message };
  }
};

export const checkMongo = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'up' };
  } catch (err) {
    logger.error('MongoDB healthcheck failed', err);
    return { status: 'down', error: err.message };
  }
};

export const healthCheck = async (pgPool) => {
  const [postgres, mongo] = await Promise.all([
    checkPostgres(pgPool),
    checkMongo(),
  ]);

  return {
    postgres,
    mongo,
  };
};
