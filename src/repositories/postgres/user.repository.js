import { User } from '../../models/postgres/user.model.js';

export const UserRepository = {
    findByEmail: async (email) => {
        return await User.findOne({ where: { email } });
    },

    findById: async (id) => {
        return await User.findByPk(id);
    },

    findAll: async () => {
        return await User.findAll();
    },

    create: async (data) => {
        return await User.create({
            username: data.username || data.userName,
            email: data.email,
            passwordHash: data.passwordHash || data.password,
            salt: data.salt,
            roleId: data.roleId
        });
    },

    deleteById: async (id) => {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            return true;
        }
        return false;
    },

    updateRole: async (userId, roleId) => {
        const user = await User.findByPk(userId);
        if (!user) return null;
        user.roleId = roleId;
        await user.save();
        return user;
    },

    count: async () => {
        return await User.count();
    },
};