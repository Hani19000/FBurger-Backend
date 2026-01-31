import { ReviewRepository } from '../repositories/mongodb/review.repository.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { User } from '../models/postgres/index.js';

export const reviewService = {
    createReview: async ({ rating, content, userId }) => {
        if (rating < 1 || rating > 5) {
            throw new AppError('Rating must be between 1 and 5', HTTP_STATUS.BAD_REQUEST);
        }
        return await ReviewRepository.create({ rating, content, userId });
    },

    getAllReviews: async (options) => {
        // 1- récupération des avis bruts depuis Mongo
        const reviews = await ReviewRepository.findAll(options);

        // 2- on complete les avis avec les donnéesde postgres
        return await Promise.all(reviews.map(async (review) => {
            const reviewObj = review.toObject ? review.toObject() : review;

            // 3- récupération de l'user dans postgres via l'UUID stocké dans Mongo
            const user = await User.findByPk(reviewObj.userId, {
                attributes: ['username', 'id']
            });
            return {
                ...reviewObj,
                userId: {
                    id: reviewObj.userId,
                    username: user ? user.username : "User"
                }
            };
        }));
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