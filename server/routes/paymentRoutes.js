import { Router } from 'express';
import {
  createPaymentForOrder,
  getMyPayments,
  updatePaymentStatusByAdmin,
} from '../controllers/paymentController.js';
import { securePrivate } from '../middlewares/secureRoute.js';
import { createPaymentValidator, paymentStatusUpdateValidator } from '../validators/paymentValidators.js';

const router = Router();

router.get('/my', ...securePrivate({ roles: ['user', 'admin'] }), getMyPayments);
router.post(
  '/order/:orderId',
  ...securePrivate({ roles: ['user', 'admin'], validators: createPaymentValidator }),
  createPaymentForOrder
);
router.patch('/:id/status', ...securePrivate({ roles: ['admin'], validators: paymentStatusUpdateValidator }), updatePaymentStatusByAdmin);

export default router;
