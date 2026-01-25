import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getStats);

export default router;
