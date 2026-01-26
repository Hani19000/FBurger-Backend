import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    userId: { type: String, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true, minlength: 10, maxlength: 500 },
}, {
    timestamps: true,
});

reviewSchema.index({ userId: 1, createdAt: -1 });

export const Review = model('Review', reviewSchema);
