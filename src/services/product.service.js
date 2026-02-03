import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import fs from 'fs/promises';
import path from 'path';

export const productService = {
    getAllProducts: async (options) => {
        const defaults = { limit: 20, page: 1 };
        const queryOptions = { ...defaults, ...options };
        const result = await ProductRepository.findAll(queryOptions);
        return result.rows ? result.rows : result;
    },

    getProductById: async (id) => {
        const product = await ProductRepository.findById(id);
        if (!product) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
        return product;
    },

    createProduct: async (data) => {
        return await ProductRepository.create(data);
    },

    updateProduct: async (id, data) => {
        // 1. Récupérer l'ancien produit pour connaître l'ancienne image
        const oldProduct = await ProductRepository.findById(id);
        if (!oldProduct) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);

        // 2. Mettre à jour en BDD
        const updatedProduct = await ProductRepository.update(id, data);

        // 3. Optionnel : Supprimer l'ancien fichier si une nouvelle image est fournie
        if (data.image_url && oldProduct.image_url && oldProduct.image_url !== data.image_url) {
            const oldPath = path.join(process.cwd(), 'public', oldProduct.image_url);
            fs.unlink(oldPath).catch(err => console.error("Erreur suppression ancien fichier:", err));
        }

        return updatedProduct;
    },

    deleteProduct: async (id) => {
        await ProductRepository.deleteById(id);
    },
};