import * as healthService from '../services/health.service.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getHealth = async (_, res) => {
    try {
        const health = await healthService.checkSystemHealth();
        res.status(HTTP_STATUS.OK).json(health);
    } catch (error) {
        logger.error('Healthcheck failed', error);
        res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({ status: 'DOWN', error: 'Service Unavailable' });
    }
};