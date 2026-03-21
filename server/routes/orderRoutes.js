import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { securePrivate } from '../middlewares/secureRoute.js';
import { createOrderValidator, orderIdValidator, updateOrderStatusValidator } from '../validators/orderValidators.js';

const router = Router();

router.post('/', ...securePrivate({ roles: ['user', 'admin'], validators: createOrderValidator }), createOrder);
router.get('/my', ...securePrivate({ roles: ['user', 'admin'] }), getMyOrders);
router.get('/admin/all', ...securePrivate({ roles: ['admin'] }), getAllOrders);
router.get('/:id', ...securePrivate({ roles: ['user', 'admin'], validators: orderIdValidator }), getOrderById);
router.patch('/:id/status', ...securePrivate({ roles: ['admin'], validators: updateOrderStatusValidator }), updateOrderStatus);

export default router;
