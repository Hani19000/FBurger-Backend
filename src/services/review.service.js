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

        // 2. Extraction des IDs utilisateurs uniques
        // 3. Récupération groupée des utilisateurs dans Postgres
        // 2. Extraction et Nettoyage des IDs
        // On s'assure que ce sont des strings propres sans espaces
        const userIds = [...new Set(reviews.map(r => r.userId.toString().trim()))];

        // 3. Récupération groupée
        const users = await User.unscoped().findAll({
            where: {
                id: userIds // Sequelize devrait caster, mais on vérifie la correspondance
            },
            attributes: ['id', 'username'],
            raw: true
        });

        // 4. Création de la Map (Crucial : on force la clé en minuscule pour la comparaison)
        const userMap = users.reduce((acc, user) => {
            // On stocke la clé en minuscule pour éviter les problèmes de casse UUID
            acc[user.id.toLowerCase()] = user.username;
            return acc;
        }, {});

        // 5. Assemblage
        return reviews.map(review => {
            const reviewObj = review.toObject ? review.toObject() : review;
            // On compare en minuscule
            const userIdStr = reviewObj.userId.toString().toLowerCase().trim();

            return {
                ...reviewObj,
                userId: {
                    id: reviewObj.userId,
                    username: userMap[userIdStr] || "Utilisateur anonyme"
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