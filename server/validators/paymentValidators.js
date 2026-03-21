import { body, param } from 'express-validator';

export const orderIdParamValidator = [param('orderId').isMongoId()];
export const paymentIdParamValidator = [param('id').isMongoId()];

export const createPaymentValidator = [
  ...orderIdParamValidator,
  body('method').isIn(['cod', 'card', 'upi', 'netbanking']),
];

export const paymentStatusUpdateValidator = [
  ...paymentIdParamValidator,
  body('status').isIn(['success', 'failed', 'refunded']),
  body('gatewayTxnId').optional().trim().isLength({ min: 3, max: 120 }),
  body('failureReason').optional().trim().isLength({ max: 300 }),
];
