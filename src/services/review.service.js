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
            const reviews = await ReviewRepository.findAll(options);
            if (!Array.isArray(reviews) || reviews.length === 0) return [];

            // 1. EXTRACTION SÉCURISÉE : On garde les IDs en tant que String (UUID)
            // On filtre uniquement pour s'assurer qu'on n'envoie pas de valeurs vides
            const userIds = [...new Set(reviews.map(r => r.userId))].filter(id => id != null && id !== '');

            let userMap = {};

            if (userIds.length > 0) {
                try {
                    // 2. RECHERCHE POSTGRES : userIds contient maintenant des UUID (Strings)
                    const users = await User.findAll({
                        where: { id: userIds },
                        attributes: ['id', 'username'],
                        raw: true
                    });

                    users.forEach(u => {
                        userMap[u.id] = u.username;
                    });
                } catch (dbError) {
                    // Si Postgres râle encore, on log l'erreur mais on affiche les avis
                    console.error("ERREUR TYPE SQL (UUID vs Integer):", dbError.message);
                }
            }

            // 3. MAPPING FINAL
            return reviews.map(review => {
                const r = review.toObject ? review.toObject() : review;
                // On utilise l'ID brut pour chercher dans la Map (UUID String)
                const currentUserId = r.userId;

                return {
                    ...r,
                    userId: {
                        id: currentUserId,
                        username: userMap[currentUserId] || "Utilisateur anonyme"
                    }
                };
            });
        } catch (error) {
            console.error("CRASH SERVICE REVIEWS:", error);
            return [];
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