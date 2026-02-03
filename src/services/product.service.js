import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { cloudinary } from '../config/cloudinary.js';

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
        const product = await ProductRepository.update(id, data);
        if (!product) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
        return product;
    },

    /**
     * Supprime un produit et son média distant associé
     * @param {number|string} id - Identifiant du produit
     * @throws {AppError} Si le produit n'existe pas
     */
    deleteProduct: async (id) => {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new AppError('Produit introuvable', HTTP_STATUS.NOT_FOUND);
        }

        if (product.image_url?.includes('cloudinary')) {
            try {
                const parts = product.image_url.split('/');
                const filename = parts.at(-1).split('.')[0];
                const folder = parts.at(-2);
                const publicId = `${folder}/${filename}`;

                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                // Échec silencieux pour garantir la suppression en base de données
                // même en cas d'erreur réseau avec le stockage distant
            }
        }

        await ProductRepository.deleteById(id);
    },
};