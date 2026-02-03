import { Product } from '../../models/postgres/product.model.js';

export const ProductRepository = {
    findAll: async ({ page = 1, limit = 10, categorie }) => {
        const offset = (page - 1) * limit;
        const where = {};
        if (categorie) where.categorie = categorie;

        return await Product.findAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [['id', 'ASC']],
        });
    },

    findById: async (id) => {
        return await Product.findByPk(id);
    },

    create: async (data) => {
        return await Product.create({
            name: data.name,
            categorie: data.categorie || data.category,
            image_url: data.image_url || data.image,
            prix: data.prix || data.price,
            description: data.description,
        });
    },
    update: async (id, data) => {
        const product = await Product.findByPk(id);
        if (!product) return null;
        await product.update(data);
        return product;
    },

    deleteById: async (id) => {
        const product = await Product.findByPk(id);
        if (product) await product.destroy();
    },

    count: async () => {
        return await Product.count();
    },
};