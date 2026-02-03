import { UserRepository } from '../repositories/postgres/user.repository.js';
import { RoleRepository } from '../repositories/postgres/role.repository.js';
import { ReviewRepository } from '../repositories/mongodb/review.repository.js';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const userService = {
    getUserById: async (userId) => {
        const user = await UserRepository.findById(userId);
        if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

        return user;
    },

    getAllUsers: async () => {
        return await UserRepository.findAll();
    },

    deleteUser: async (userId) => {
        // 1. On nettoie d'abord MongoDB pour éviter les avis orphelins dans le cas ou la suppression Postgres échouait
        await ReviewRepository.deleteManyByUserId(userId);

        // 2. On supprime l'utilisateur de PostgreSQL
        const deleted = await UserRepository.deleteById(userId);

        if (!deleted) {
            throw new AppError('User not found or already deleted', HTTP_STATUS.NOT_FOUND);
        }
        return true;
    },

    updateUserRole: async (userId, roleName) => {
        const role = await RoleRepository.findByName(roleName);
        if (!role) throw new AppError('Role not found', HTTP_STATUS.NOT_FOUND);

        const user = await UserRepository.updateRole(userId, role.id);
        if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

        return user;
    },
};