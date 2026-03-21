import { body, param } from 'express-validator';

export const orderIdValidator = [param('id').isMongoId()];

export const createOrderValidator = [
  body('shippingAddress').trim().isLength({ min: 8, max: 300 }),
];

export const updateOrderStatusValidator = [
  ...orderIdValidator,
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
];
