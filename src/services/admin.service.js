import { UserRepository } from '../repositories/postgres/user.repository.js';
import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { ReviewRepository } from '../repositories/mongodb/review.repository.js';

export const AdminService = {
    GetDashboardStats: async () => {
        // Exécution parallèle pour de meilleures performances
        const [users, products, reviews] = await Promise.all([
            UserRepository.count(),
            ProductRepository.count(),
            ReviewRepository.count()
        ]);

        return {
            users,
            products,
            reviews,
            updatedAt: new Date()
        }
    }
}