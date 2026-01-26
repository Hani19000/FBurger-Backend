import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { UserRepository } from '../repositories/postgres/user.repository.js';
import { ProductRepository } from '../repositories/postgres/product.repository.js';
import { ReviewRepository } from '../repositories/mongodb/review.repository.js';
import {HTTP_STATUS} from '../constants/httpStatus.js';

export const getStats = asyncHandler(async (_req, res) => {
    const [users, products, reviews] = await Promise.all([
        UserRepository.count(),
        ProductRepository.count(),
        ReviewRepository.count()
    ]);

    sendSuccess(res, HTTP_STATUS.OK, {
        users,
        products,
        reviews
    });
});
