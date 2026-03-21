import { body, param } from 'express-validator';

export const productIdValidator = [param('productId').isMongoId()];
export const reviewIdValidator = [param('id').isMongoId()];

export const createReviewValidator = [
  body('product').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 10, max: 600 }),
  body('imageSrc').optional({ nullable: true }).isString().isLength({ max: 3000000 }),
];
