
import mongoose from 'mongoose';
import { ENV } from './environment.js';
import { logger } from '../utils/logger.js';

export {pgSequelize, connectPostgres} from './sequelize.js'

export const connectMongoDB = async () => {
    try {
        const uri = ENV.database.mongo.uri;
        
        if (!uri) {
            throw new Error("MONGO_URI est manquante dans les variables d'environnement");
        }

        await mongoose.connect(uri);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        throw error;
    }
};


export const closeDatabases = async () => {
    try {
        await pgSequelize.close();
        await mongoose.connection.close();
        logger.info('All database connections closed');
    } catch (error) {
        logger.error('Error while closing databases:', error);
    }
};