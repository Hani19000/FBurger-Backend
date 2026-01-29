import { DataTypes } from 'sequelize';
import { pgSequelize } from '../../config/sequelize.js';

export const Product = pgSequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    categorie: { type: DataTypes.STRING(255), allowNull: false },
    prix: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image_url: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT, allowNull: false },
}, {
    tableName: 'products',
    timestamps: true,
});