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


    // src/services/review.service.js

    getAllReviews: async (options = {}) => {
        try {
            // 1. Récupération des reviews depuis MongoDB
            const reviews = await ReviewRepository.findAll(options);

            if (!Array.isArray(reviews) || reviews.length === 0) {
                return [];
            }

            // 2. Extraction des IDs utilisateurs (UUID format String)
            const userIds = [...new Set(
                reviews
                    .map(r => r.userId)
                    .filter(id => id != null && id !== '')
            )];

            // 3. Récupération des informations utilisateurs depuis PostgreSQL
            let userMap = {};

            if (userIds.length > 0) {
                try {
                    const users = await User.findAll({
                        where: { id: userIds },
                        attributes: ['id', 'username'],
                        raw: true
                    });

                    // Construction de la Map id -> username
                    users.forEach(user => {
                        userMap[user.id] = user.username;
                    });
                } catch (dbError) {
                    console.error("Erreur lors de la récupération des utilisateurs:", {
                        message: dbError.message,
                        userIds: userIds.slice(0, 3) // Log des 3 premiers IDs pour debug
                    });
                    // On continue même si la récupération des users échoue
                }
            }

            // 4. Mapping final : enrichissement des reviews avec les infos utilisateurs
            return reviews.map(review => {
                const reviewObject = review.toObject ? review.toObject() : review;
                const userId = reviewObject.userId;

                return {
                    ...reviewObject,
                    userId: {
                        id: userId,
                        username: userMap[userId] || "Utilisateur anonyme"
                    }
                };
            });

        } catch (error) {
            console.error("Erreur dans reviewService.getAllReviews:", error);
            throw new AppError(
                'Impossible de récupérer les avis',
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
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