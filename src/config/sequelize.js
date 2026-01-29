import { Sequelize } from 'sequelize';
import { ENV } from './environment.js';
import { logger } from '../utils/logger.js';

export const pgSequelize = new Sequelize(
  ENV.database.postgres.database,
  ENV.database.postgres.user,
  ENV.database.postgres.password,
  {
    host: ENV.database.postgres.host,
    port: ENV.database.postgres.port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: ENV.server.nodeEnv === 'production' ? {
        require: true,
        rejectUnauthorized: false // obligatoire pour Render
      } : false // Désactivation du SSL en local
    }
  }
);

export const connectPostgres = async () => {
  try {
    await import('../models/postgres/index.js');
    await pgSequelize.authenticate();
    // await pgSequelize.sync({ alter: true }); //pas de synchro automatique

    logger.info('PostgreSQL: Connected & Synchronized');
  } catch (error) {
    logger.error('PostgreSQL: Connection failed', error);
    throw error;
  }
};

export const closePostgres = async () => {
  try {
    await pgSequelize.close();
    logger.info('PostgreSQL connection closed');
  } catch (err) {
    logger.error('Error closing PostgreSQL', err);
  }
};