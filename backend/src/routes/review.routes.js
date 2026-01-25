import { Router } from 'express';
import { createReview, getAllReviews, updateReview, deleteReview } from '../controllers/review.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { handleValidationErrors } from '../middlewares/validator.middleware.js';
import { createReviewValidation } from '../validators/review.validator.js';
import { requireAdmin } from '../middlewares/auth.middleware.js'

const router = Router();

router.get('/', getAllReviews);
router.post('/', authenticateToken, createReviewValidation, handleValidationErrors, createReview);
router.put('/:id', authenticateToken, requireAdmin, updateReview);
router.delete('/:id', authenticateToken, requireAdmin, deleteReview);

export default router;
