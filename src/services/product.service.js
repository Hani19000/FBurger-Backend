import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const productService = {
    getAllProducts: async (options) => {
        const defaults = { limit: 20, page: 1 };
        const queryOptions = { ...defaults, ...options };
        return await ProductRepository.findAll(queryOptions);
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

    deleteProduct: async (id) => {
        await ProductRepository.deleteById(id);
    },
};