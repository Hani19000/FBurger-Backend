import { reviewService } from '../services/review.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {HTTP_STATUS} from '../constants/httpStatus.js';

export const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview({
        ...req.body,
        userId: req.user.id 
    });
    sendSuccess(res, HTTP_STATUS.CREATED, review);
});


export const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getAllReviews(req.query);
    sendSuccess(res, HTTP_STATUS.OK, reviews);
});

export const updateReview = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview( req.params.id, req.body);
    sendSuccess(res, HTTP_STATUS.OK, review);
});

export const deleteReview = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, { message: 'Review deleted successfully' });
});