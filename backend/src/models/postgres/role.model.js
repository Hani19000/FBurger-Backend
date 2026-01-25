import { DataTypes } from 'sequelize';
import { pgSequelize } from '../../config/sequelize.js';

export const Role = pgSequelize.define('Role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {type: DataTypes.STRING(50), allowNull: false, unique: true},
}, {
    tableName: 'roles',
    timestamps: false, 
});