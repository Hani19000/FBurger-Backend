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
        const userIds = [...new Set(reviews.map(r => r.userId))];

        // 3. Récupération groupée des utilisateurs dans Postgres
        const users = await User.unscoped().findAll({ // On utilise .unscoped() pour ignorer le defaultScope
            where: {
                id: userIds
            },
            attributes: ['id', 'username'],
            raw: true // On récupère des données brutes pour plus de rapidité
        })

        console.log('Nombre d utilisateurs trouvés dans Postgres:', users.length);
        console.log('IDs recherchés:', userIds);

        // 4. Création d'une "Map" pour un accès instantané
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user.username;
            return acc;
        }, {});

        return reviews.map(review => {
            const reviewObj = review.toObject ? review.toObject() : review;
            // On force aussi la clé de recherche en string
            const userIdStr = reviewObj.userId.toString();
            console.log('UserMap Keys:', Object.keys(userMap));
            console.log('First Review UserId:', reviews[0]?.userId);
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