import { ReviewRepository } from '../repositories/mongodb/review.repository.js';
import { AppError } from '../utils/appError.js';
import {HTTP_STATUS} from '../constants/httpStatus.js';

export const reviewService = {
    createReview: async ({ rating, content, userId }) => {
        if (rating < 1 || rating > 5) {
            throw new AppError('Rating must be between 1 and 5', HTTP_STATUS.BAD_REQUEST);
        }
        return await ReviewRepository.create({ rating, content, userId });
    },

    getAllReviews: async (options) => {
        return await ReviewRepository.findAll(options);
    },

    updateReview: async (reviewId, data) => {
        const review = await ReviewRepository.update(reviewId, data);
        if (!review) {
            throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);
        }
        return review;
    },

    deleteReview: async (reviewId) => {
        const success = await ReviewRepository.deleteById(reviewId);
        if (!success) {
            throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);
        }
    }
};