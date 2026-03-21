import { body } from 'express-validator';
import { param } from 'express-validator';

export const addToCartValidator = [
  body('productId').isMongoId(),
  body('quantity').optional().isInt({ min: 1, max: 20 }),
];

export const updateCartItemValidator = [
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 1, max: 20 }),
];

export const removeCartItemValidator = [body('productId').isMongoId()];
export const removeCartItemByParamValidator = [param('productId').isMongoId()];
