import { UserRepository } from '../repositories/postgres/user.repository.js';
import { RoleRepository } from '../repositories/postgres/role.repository.js';
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
        const deleted = await UserRepository.deleteById(userId);
        if (!deleted) throw new AppError('User not found or already deleted', HTTP_STATUS.NOT_FOUND);
    },

    updateUserRole: async (userId, roleName) => {
        const role = await RoleRepository.findByName(roleName);
        if (!role) throw new AppError('Role not found', HTTP_STATUS.NOT_FOUND);

        const user = await UserRepository.updateRole(userId, role.id);
        if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

        return user;
    },
};