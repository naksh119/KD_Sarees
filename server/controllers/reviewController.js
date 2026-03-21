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
  console.log('[Review:createOrUpdate] Incoming payload', {
    product,
    rating,
    commentLength: typeof comment === 'string' ? comment.length : null,
    hasImageSrc: Boolean(imageSrc),
    userId: req.user?._id,
  });

  const exists = await Product.findById(product);
  if (!exists) {
    console.warn('[Review:createOrUpdate] Product not found', {
      productId: product,
      userId: req.user?._id,
    });
    throw new ApiError(404, 'Product not found');
  }

  let review;
  try {
    review = await Review.findOneAndUpdate(
      { product, user: req.user._id },
      { rating, comment, imageSrc: imageSrc || '', isApproved: true },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.error('[Review:createOrUpdate] Failed to store review', {
      productId: product,
      userId: req.user?._id,
      rating,
      commentLength: typeof comment === 'string' ? comment.length : null,
      errorName: error?.name,
      errorMessage: error?.message,
      errorCode: error?.code,
      validationErrors: error?.errors
        ? Object.fromEntries(
            Object.entries(error.errors).map(([key, val]) => [key, val?.message])
          )
        : null,
    });
    throw error;
  }

  console.log('[Review:createOrUpdate] Review saved successfully', {
    reviewId: review?._id,
    productId: product,
    userId: req.user?._id,
  });
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
