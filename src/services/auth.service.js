import { UserRepository } from '../repositories/postgres/user.repository.js';
import { passwordService } from './password.service.js';
import { tokenService } from './token.service.js';
import { sessionService } from './session.service.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { Role, User } from '../models/postgres/index.js';

// Fonction helper interne pour éviter la répétition (DRY)
async function createAuthSession(user) {
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    await sessionService.createSession(user.id, refreshToken);

    return { user, accessToken, refreshToken };
}

export const authService = {
    register: async ({ username, email, password }) => {
        // 1. Vérification existance
        const existing = await UserRepository.findByEmail(email);
        if (existing) throw new AppError('Email déjà utilisé', HTTP_STATUS.CONFLICT);

        // 2. Gestion du rôle par défaut
        const userRole = await Role.findOne({ where: { name: 'UTILISATEUR' } });
        if (!userRole) throw new AppError('Configuration serveur : Rôle introuvable', 500);

        // 3. Sécurité
        const salt = passwordService.generateSalt();
        const passwordHash = await passwordService.hashPassword(password, salt);

        // 4. Création
        const user = await UserRepository.create({
            username: username,
            email: email,
            passwordHash: passwordHash,
            salt: salt,
            roleId: userRole.id
        });

        const userWithRole = await User.scope('withPassword').findOne({
            where: { id: user.id },
            include: [{ model: Role, as: 'Role' }]
        });
        // 5. Tokens & Session
        return await createAuthSession(userWithRole);
    },

    login: async (email, password) => {
        const normalizedEmail = email.toLowerCase();
        const user = await User.scope('withPassword').findOne({
            where: { email },
            include: [{ model: Role, as: 'Role' }]
        });
        if (!user) {
            console.log("Debug: Utilisateur non trouvé pour l'email:", normalizedEmail);
            throw new AppError('Identifiants invalides', HTTP_STATUS.UNAUTHORIZED);
        }
        const isValid = await passwordService.comparePassword(password, user.passwordHash);
        if (!isValid) {
            throw new AppError('Identifiants invalides', HTTP_STATUS.UNAUTHORIZED);
        }
        return await createAuthSession(user);
    },


    logout: async (refreshToken) => {
        if (!refreshToken) return;
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