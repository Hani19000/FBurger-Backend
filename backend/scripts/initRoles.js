import { Role } from '../src/models/postgres/role.model.js';
import { logger } from '../src/utils/logger.js';
import { ROLES } from '../src//constants/roles.js';

export const initRoles = async () => {
    try {
        const rolesToCreate = Object.values(ROLES);
        
        for (const roleName of rolesToCreate) {
            const [role, created] = await Role.findOrCreate({
                where: { name: roleName },
                defaults: { name: roleName }
            });
            
            if (created) {
                logger.info(`Role created: ${roleName}`);
            } else {
                logger.debug(`Role already exists: ${roleName}`);
            }
        }
        
        logger.info('Roles initialization completed');
    } catch (err) {
        logger.error('Error initializing roles:', err);
        throw err;
    }
};