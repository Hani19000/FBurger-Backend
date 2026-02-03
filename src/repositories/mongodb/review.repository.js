import { Review } from '../../models/mongodb/reviews.model.js';

export const ReviewRepository = {
    create: async ({ rating, content, userId }) => {
        return await Review.create({ rating, content, userId });
    },

    findById: async (id) => {
        return await Review.findById(id);
    },

    findAll: async ({ page = 1, limit = 10 } = {}) => {
        const sanitizedLimit = parseInt(limit) || 10;
        const sanitizedPage = parseInt(page) || 1;
        const skip = (sanitizedPage - 1) * sanitizedLimit;

        return await Review.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(sanitizedLimit);
    },

    findByUserId: async (userId, { page = 1, limit = 10 }) => {
        const skip = (page - 1) * limit;
        return await Review.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
    },

    update: async (id, { rating, content }) => {
        const review = await Review.findById(id);
        if (!review) return null;
        if (rating !== undefined) review.rating = rating;
        if (content !== undefined) review.content = content;
        await review.save();
        return review;
    },

    deleteById: async (id) => {
        const review = await Review.findById(id);
        if (review) {
            await review.deleteOne();
            return true;
        }
        return false;
    },

    deleteManyByUserId: async (userId) => {
        // Supprime tous les avis dont le userId correspond
        return await Review.deleteMany({ userId: userId.toString() });
    },

    count: async () => {
        return await Review.countDocuments();
    },

    isOwner: async (reviewId, userId) => {
        const review = await Review.findById(reviewId);
        return review && review.userId.toString() === userId.toString();
    },

    count: async () => {
        return await Review.countDocuments();
    },
};