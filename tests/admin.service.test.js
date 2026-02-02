import { expect, test, vi } from 'vitest';
import { AdminService } from '../src/services/admin.service.js';
import { UserRepository } from '../src/repositories/postgres/user.repository.js';
import { ProductRepository } from '../src/repositories/postgres/product.repository.js';
import { ReviewRepository } from '../src/repositories/mongodb/review.repository.js';

// On simule (mock) les repositories pour ne pas toucher à la DB
vi.mock('../src/repositories/postgres/user.repository.js');
vi.mock('../src/repositories/postgres/product.repository.js');
vi.mock('../src/repositories/mongodb/review.repository.js');

test('AdminService.getDashboardStats devrait agréger les résultats des mocks', async () => {
    // On définit ce que les fonctions count() doivent renvoyer
    UserRepository.count.mockResolvedValue(10);
    ProductRepository.count.mockResolvedValue(50);
    ReviewRepository.count.mockResolvedValue(100);

    const stats = await AdminService.getDashboardStats();

    expect(stats).toEqual({
        users: 10,
        products: 50,
        reviews: 100
    });

    console.log("✅ Logique du Service validée avec des Mocks !");
});