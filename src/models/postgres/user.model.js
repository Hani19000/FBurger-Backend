import { DataTypes } from 'sequelize';
import { pgSequelize } from '../../config/sequelize.js';

export const User = pgSequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING(255), field: 'username', allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), field: 'passwordhash', allowNull: false },
    salt: { type: DataTypes.STRING(255), allowNull: false },
    roleId: { type: DataTypes.INTEGER, field: 'role_id', allowNull: false, references: { model: 'roles', key: 'id' } },
}, {
    tableName: 'users',
    timestamps: false,
});