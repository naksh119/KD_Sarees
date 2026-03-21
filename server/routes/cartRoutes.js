import { Router } from 'express';
import {
  addToCart,
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';
import { securePrivate } from '../middlewares/secureRoute.js';
import {
  addToCartValidator,
  removeCartItemByParamValidator,
  removeCartItemValidator,
  updateCartItemValidator,
} from '../validators/cartValidators.js';

const router = Router();

router.get('/', ...securePrivate({ roles: ['user', 'admin'] }), getMyCart);
router.post('/add', ...securePrivate({ roles: ['user', 'admin'], validators: addToCartValidator }), addToCart);
router.patch('/item', ...securePrivate({ roles: ['user', 'admin'], validators: updateCartItemValidator }), updateCartItem);
router.delete('/item', ...securePrivate({ roles: ['user', 'admin'], validators: removeCartItemValidator }), removeCartItem);
router.delete(
  '/item/:productId',
  ...securePrivate({ roles: ['user', 'admin'], validators: removeCartItemByParamValidator }),
  removeCartItem
);
router.delete('/clear', ...securePrivate({ roles: ['user', 'admin'] }), clearCart);

export default router;
