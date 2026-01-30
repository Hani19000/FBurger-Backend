import { Router } from 'express';
import { register, login, logout, refreshToken, getMe } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validators/auth.validator.js';
import { handleValidationErrors } from '../middlewares/validator.middleware.js';
import { authLimiter } from '../config/security.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authLimiter, registerValidation, handleValidationErrors, register);
router.post('/login', authLimiter, loginValidation, handleValidationErrors, login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getMe);

export default router;
