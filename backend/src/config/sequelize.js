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
    logging: (msg) => logger.debug(msg),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export const connectPostgres = async () => {
  try {
    // 1. Charger TOUS les modèles AVANT authenticate
    logger.info('Loading PostgreSQL models...');
    await import('../models/postgres/index.js');
    logger.info('PostgreSQL models loaded');

    // 2. Vérifier la connexion
    await pgSequelize.authenticate();
    logger.info('PostgreSQL connected via Sequelize');

    // 3. Synchroniser (force: false pour ne pas drop les tables)
    logger.info('Synchronizing database tables...');
    await pgSequelize.sync({ force: false, alter: true });
    logger.info('PostgreSQL tables synchronized successfully');
  } catch (err) {
    logger.error('PostgreSQL connection/sync failed', err);
    throw err;
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