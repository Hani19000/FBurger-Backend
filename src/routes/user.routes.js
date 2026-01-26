import { Router } from 'express';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { updateRoleValidation } from '../validators/user.validator.js';
import { handleValidationErrors } from '../middlewares/validator.middleware.js';

const router = Router();

router.use(authenticateToken, requireAdmin);
router.get('/', getAllUsers);
router.delete('/:userId', deleteUser);
router.patch('/:userId/role', updateRoleValidation, handleValidationErrors, updateUserRole);

export default router;
