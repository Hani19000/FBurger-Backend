import { UserRepository } from '../repositories/postgres/user.repository.js';
import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { ReviewRepository } from '../repositories/mongodb/review.repository.js';

export const AdminService = {
    getDashboardStats: async () => {
        try {
            const users = await UserRepository.count();
            console.log('Users OK:', users);

            const products = await ProductRepository.count();
            console.log('Products OK:', products);

            const reviews = await ReviewRepository.count();
            console.log('Reviews OK:', reviews);

            return { users, products, reviews };
        } catch (error) {
            console.error("ERREUR DÉTAILLÉE SERVICE:", error);
            throw error; // Renvoie l'erreur au asyncHandler
        }
    }
};