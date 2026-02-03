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
        if (!reviews || reviews.length === 0) return [];

        // 2. Extraction et filtrage des IDs (on retire les null/undefined)
        const userIds = [...new Set(reviews.map(r => r.userId))].filter(Boolean);

        let userMap = {};

        if (userIds.length > 0) {
            // 3. Récupération groupée
            const users = await User.findAll({
                where: { id: userIds },
                attributes: ['id', 'username']
            });

            // 4. Création d'une "Map" pour un accès instantané
            userMap = users.reduce((acc, user) => {
                acc[user.id] = user.username;
                return acc;
            }, {});
        }

        return reviews.map(review => {
            const reviewObj = review.toObject ? review.toObject() : review;
            return {
                ...reviewObj,
                userId: {
                    id: reviewObj.userId,
                    username: userMap[reviewObj.userId] || "Utilisateur anonyme"
                }
            };
        });
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