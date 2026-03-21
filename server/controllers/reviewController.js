import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find({ isApproved: true })
    .populate('user', 'name')
    .populate('product', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export const createOrUpdateMyReview = asyncHandler(async (req, res) => {
  const { product, rating, comment, imageSrc } = req.body;
  const exists = await Product.findById(product);
  if (!exists) throw new ApiError(404, 'Product not found');

  const review = await Review.findOneAndUpdate(
    { product, user: req.user._id },
    { rating, comment, imageSrc: imageSrc || '', isApproved: true },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not allowed');
  }
  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});
