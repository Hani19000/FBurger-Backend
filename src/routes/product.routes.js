import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { createProductValidation, updateProductValidation } from '../validators/product.validator.js';
import { handleValidationErrors } from '../middlewares/validator.middleware.js';
import { uploadCloud } from '../config/cloudinary.js';

const router = Router();

// Routes publiques
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protection globale pour les routes suivantes
router.use(authenticateToken, requireAdmin);

// Route de création (une seule fois avec les validateurs)
router.post('/', uploadCloud.single('image'), createProductValidation, handleValidationErrors, createProduct);


router.put('/:id', uploadCloud.single('image'), updateProductValidation, handleValidationErrors, updateProduct);

router.delete('/:id', deleteProduct);

export default router;