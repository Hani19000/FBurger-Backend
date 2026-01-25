import { HTTP_STATUS } from '../constants/httpStatus.js';

export class AppError extends Error {
    constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, new.target.prototype);


        Error.captureStackTrace(this);
    }
}
