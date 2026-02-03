import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts(req.query);
    sendSuccess(res, HTTP_STATUS.OK, products);
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, product);
});

export const updateProduct = asyncHandler(async (req, res) => {
    const updateData = { ...req.body };
    // Si un nouveau fichier a été uploadé via le middleware multer
    if (req.file) {
        // On construit le chemin relatif pour la BDD (ex: /images/123-img.jpg)
        updateData.image_url = `/images/${req.file.filename}`;
    }
    const product = await productService.updateProduct(
        req.params.id,
        updateData
    );
    sendSuccess(res, HTTP_STATUS.OK, product);
});

export const createProduct = asyncHandler(async (req, res) => {
    const productData = { ...req.body };
    if (req.file) {
        productData.image_url = `/images/${req.file.filename}`;
    }
    const product = await productService.createProduct(productData);
    sendSuccess(res, HTTP_STATUS.CREATED, product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, { message: 'Product deleted successfully' });
});
