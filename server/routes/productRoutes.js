import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  bulkCreateProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  createProductValidator,
  bulkCreateProductsValidator,
  updateProductValidator,
  mongoIdParamValidator,
} from '../validators/productValidators.js';
import { securePrivate, securePublic } from '../middlewares/secureRoute.js';

const router = Router();

router.get('/', getProducts);
router.post(
  '/bulk',
  ...securePrivate({ roles: ['admin'], validators: bulkCreateProductsValidator }),
  bulkCreateProducts
);
router.get('/:id', ...securePublic(...mongoIdParamValidator), getProductById);
router.post('/', ...securePrivate({ roles: ['admin'], validators: createProductValidator }), createProduct);
router.put('/:id', ...securePrivate({ roles: ['admin'], validators: updateProductValidator }), updateProduct);
router.delete(
  '/:id',
  ...securePrivate({ roles: ['admin'], validators: mongoIdParamValidator }),
  deleteProduct
);

export default router;
