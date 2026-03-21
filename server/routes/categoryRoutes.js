import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { securePrivate, securePublic } from '../middlewares/secureRoute.js';
import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/categoryValidators.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', ...securePublic(...categoryIdValidator), getCategoryById);
router.post('/', ...securePrivate({ roles: ['admin'], validators: createCategoryValidator }), createCategory);
router.put('/:id', ...securePrivate({ roles: ['admin'], validators: updateCategoryValidator }), updateCategory);
router.delete('/:id', ...securePrivate({ roles: ['admin'], validators: categoryIdValidator }), deleteCategory);

export default router;
