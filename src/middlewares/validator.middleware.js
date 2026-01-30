import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const handleValidationErrors = (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(event => event.msg).join(', ');
        return next(new AppError(message, HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
