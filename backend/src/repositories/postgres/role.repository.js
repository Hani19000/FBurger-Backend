import { Role } from '../../models/postgres/role.model.js';

export const RoleRepository = {
    findAll: async () => {
        return await Role.findAll();
    },

    findByName: async (name) => {
        return await Role.findOne({ where: { name } });
    },
};
