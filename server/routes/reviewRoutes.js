import { Router } from 'express';
import {
  createOrUpdateMyReview,
  deleteReview,
  getAllReviews,
  getProductReviews,
} from '../controllers/reviewController.js';
import { securePrivate, securePublic } from '../middlewares/secureRoute.js';
import { createReviewValidator, productIdValidator, reviewIdValidator } from '../validators/reviewValidators.js';

const router = Router();

router.get('/', getAllReviews);
router.get('/product/:productId', ...securePublic(...productIdValidator), getProductReviews);
router.post('/', ...securePrivate({ roles: ['user', 'admin'], validators: createReviewValidator }), createOrUpdateMyReview);
router.delete('/:id', ...securePrivate({ roles: ['user', 'admin'], validators: reviewIdValidator }), deleteReview);

export default router;
