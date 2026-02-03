import { UserRepository } from '../repositories/postgres/user.repository.js';
import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { ReviewRepository } from '../repositories/mongodb/review.repository.js';

export const AdminService = {
    getDashboardStats: async () => {
        try {
            const users = await UserRepository.count();

            const products = await ProductRepository.count();

            const reviews = await ReviewRepository.count();

            return { users, products, reviews };
        } catch (error) {
            throw error; // Renvoie l'erreur au asyncHandler
        }
    },

    getReviews: async () => {
        try {
            const response = await api.get('/reviews');
            // response.data contient { success: true, data: [...] }
            // On retourne donc response.data.data
            return response.data.data || [];
        } catch (error) {
            console.error("Détails erreur API:", error.response?.data);
            throw error;
        }
    },
};

