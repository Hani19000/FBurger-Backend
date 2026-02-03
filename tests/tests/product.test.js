import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { ProductRepository } from '../../src/repositories/postgres/product.repository.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Mock du Repository
vi.mock('../../src/repositories/postgres/product.repository.js', () => ({
    ProductRepository: {
        findById: vi.fn(),
        update: vi.fn(),
    }
}));

// 2. Mock des Middlewares d'Authentification
// On force next() et on injecte un user admin dans req.user
vi.mock('../../src/middlewares/auth.middleware.js', () => ({
    authenticateToken: vi.fn((req, res, next) => {
        req.user = { id: 'admin-id', role: 'admin' };
        next();
    }),
    requireAdmin: vi.fn((req, res, next) => next())
}));

describe('Product Upload Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('devrait uploader une image et mettre à jour le produit', async () => {
        // Préparation des données simulées
        ProductRepository.findById.mockResolvedValue({
            id: 1, name: 'Old Burger', image_url: '/old.jpg'
        });
        ProductRepository.update.mockResolvedValue({
            id: 1, name: 'New Burger', image_url: '/images/test-burger.png'
        });

        const testFilePath = path.join(__dirname, 'test-burger.png');
        fs.writeFileSync(testFilePath, 'fake-binary-data');

        // Exécution (on envoie quand même un faux Bearer pour la forme)
        const response = await request(app)
            .put('/api/products/1')
            .set('Authorization', 'Bearer fake-token')
            .field('name', 'New Burger')
            .field('categorie', 'Burgers')
            .field('prix', '15')
            .attach('image', testFilePath);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('New Burger');
        expect(ProductRepository.update).toHaveBeenCalled();

        if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    });
});