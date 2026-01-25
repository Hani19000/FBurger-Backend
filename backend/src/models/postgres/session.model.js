import { DataTypes } from 'sequelize';
import { pgSequelize } from '../../config/sequelize.js';

export const Session = pgSequelize.define('Session', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    refreshToken: { type: DataTypes.TEXT, field: 'refresh_token', allowNull: false},
    userId: { type: DataTypes.UUID,field: 'user_id', allowNull: false, references: { model: 'users', key: 'id' }},
    expiresAt: { type: DataTypes.DATE, field: 'expires_at', allowNull: false }
}, {
    tableName: 'sessions',
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: false         
});