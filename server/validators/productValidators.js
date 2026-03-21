import { body, param } from 'express-validator';

export const mongoIdParamValidator = [param('id').isMongoId()];

export const createProductValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('price').isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').isMongoId(),
  body('images').optional().isArray(),
];

export const updateProductValidator = [
  ...mongoIdParamValidator,
  body('name').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().isMongoId(),
  body('images').optional().isArray(),
];
