import { DataTypes } from 'sequelize';
import { pgSequelize } from '../../config/sequelize.js';

export const Product = pgSequelize.define('Product', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: {type: DataTypes.STRING(255), allowNull: false },
    categorie: {type: DataTypes.STRING(255), allowNull: false },
    price: {type: DataTypes.DECIMAL(10, 2), field: 'prix', allowNull: false },
    image: { type: DataTypes.TEXT, field: 'image_url' },
    description: { type: DataTypes.TEXT, allowNull: false },
}, {
    tableName: 'products',
    timestamps: true,
});