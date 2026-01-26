import { User } from './user.model.js';
import { Session } from './session.model.js';
import { Role } from './role.model.js';
import { Product } from './product.model.js';

// Relations User <-> Role
User.belongsTo(Role, { foreignKey: 'roleId', as: 'Role' });
Role.hasMany(User, { foreignKey: 'roleId' });

// Relations User <-> Session 
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Session, Role, Product };