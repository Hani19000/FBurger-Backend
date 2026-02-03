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

    /**
 * Récupère tous les avis en enrichissant les données avec les noms d'utilisateurs (SQL)
 * @param {Object} options - Filtres et options de pagination
 * @returns {Promise<Array>} Liste des avis enrichis
 */
    getAllReviews: async (options) => {
        // 1. Récupération des données brutes (MongoDB)
        const reviews = await ReviewRepository.findAll(options);
        if (!reviews?.length) return [];

        // 2. Identification des utilisateurs uniques (SQL) pour éviter les requêtes inutiles
        // On utilise Set pour l'unicité et filter(Boolean) pour la sécurité
        const userIds = [...new Set(reviews.map(r => r.userId))].filter(Boolean);
        let userMap = {};

        if (userIds.length > 0) {
            // 3. Récupération groupée (Bulk Fetch) - Performance optimisée
            const users = await User.findAll({
                where: { id: userIds },
                attributes: ['id', 'username']
            });

            // 4. Indexation sous forme de Map { id: username } pour un accès O(1)
            userMap = users.reduce((acc, user) => ({
                ...acc,
                [user.id]: user.username
            }), {});
        }

        // 5. Hydratation et formatage final
        return reviews.map(review => {
            const reviewData = review.toObject ? review.toObject() : { ...review };

            return {
                ...reviewData,
                // On transforme l'ID simple en objet enrichi pour le frontend
                user: {
                    id: reviewData.userId,
                    username: userMap[reviewData.userId] || "Utilisateur supprimé"
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