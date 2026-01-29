import { logger } from '../utils/logger.js';
import { ENV } from '../config/environment.js';
import * as Sentry from '@sentry/node';
import {HTTP_STATUS} from '../constants/httpStatus.js';
export const notFoundHandler = (_, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Resource not found' });
};

export const errorHandler = (err, _, res, _) => {
    logger.error(err.message, err);
    if (ENV.nodeEnv === 'production' && Sentry) {
        Sentry.captureException(err);
    }

    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        status: statusCode,
        message: err.message || 'Internal server error',
    });
};
