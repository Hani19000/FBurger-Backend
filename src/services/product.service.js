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

    deleteProduct: async (id) => {
        const product = await ProductRepository.findById(id);
        if (!product) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);

        if (product.image_url && product.image_url.includes('cloudinary')) {
            try {
                // ✅ On récupère le dossier et le nom du fichier sans l'extension
                // URL type: .../fburger_products/v12345/image_name.jpg
                const parts = product.image_url.split('/');
                const fileNameWithExtension = parts.pop(); // image_name.jpg
                const folderName = parts.pop(); // fburger_products
                const publicId = `${folderName}/${fileNameWithExtension.split('.')[0]}`;

                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error("Erreur suppression Cloudinary:", error);
            }
        }

        await ProductRepository.deleteById(id);
    },
};