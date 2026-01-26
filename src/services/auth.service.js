import { UserRepository } from '../repositories/postgres/user.repository.js';
import { passwordService } from './password.service.js';
import { tokenService } from './token.service.js';
import { sessionService } from './session.service.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { Role, User } from '../models/postgres/index.js';

export const authService = {
    register: async ({ userName, email, password }) => {
        // 1. Vérification email
        const existing = await UserRepository.findByEmail(email);
        if (existing) throw new AppError('Email already registered', HTTP_STATUS.CONFLICT);

        // 2. Récupération du rôle
        const userRole = await Role.findOne({ where: { name: 'user' } });
        if (!userRole) {
            throw new AppError('Default role not found', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        const salt = passwordService.generateSalt();
        const hash = await passwordService.hashPassword(password, salt);

        // 3. Création de l'utilisateur
        const user = await UserRepository.create({
            userName: userName,
            email: email,
            passwordHash: hash, 
            salt: salt,
            roleId: userRole.id  
        });

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        await sessionService.createSession(user.id, refreshToken);
        return { user, accessToken, refreshToken };
    },

    login: async (email, password) => {
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Role,
                as: 'Role'
            }]
        });

        if (!user) throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);

        const valid = await passwordService.comparePassword(password, user.password, user.salt);
        if (!valid) throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        await sessionService.createSession(user.id, refreshToken);
        return { user, accessToken, refreshToken };
    },

    logout: async (refreshToken) => {
        await sessionService.deleteSession(refreshToken);
    },

    refreshAccessToken: async (refreshToken) => {
        const session = await sessionService.validateSession(refreshToken);
        if (!session) throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);

        const payload = tokenService.verifyRefreshToken(refreshToken);
        if (!payload) throw new AppError('Expired or invalid refresh token', HTTP_STATUS.UNAUTHORIZED);

        const accessToken = tokenService.generateAccessToken({ id: payload.id });
        return { accessToken };
    },
};