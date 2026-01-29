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

export const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    sendSuccess(res, HTTP_STATUS.CREATED, product);
});

export const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(
        req.params.id,
        req.body
    );
    sendSuccess(res, HTTP_STATUS.OK, product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, { message: 'Product deleted successfully' });
});
