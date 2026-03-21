import { body, param } from 'express-validator';

export const categoryIdValidator = [param('id').isMongoId()];

export const createCategoryValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }),
  body('slug').optional().trim().isLength({ min: 2, max: 120 }).matches(/^[a-z0-9-]+$/),
  body('description').optional().trim().isLength({ max: 500 }),
];

export const updateCategoryValidator = [
  ...categoryIdValidator,
  body('name').optional().trim().isLength({ min: 2, max: 80 }),
  body('slug').optional().trim().isLength({ min: 2, max: 120 }).matches(/^[a-z0-9-]+$/),
  body('description').optional().trim().isLength({ max: 500 }),
];
