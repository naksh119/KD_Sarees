import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 60 }).matches(/^[A-Za-z][A-Za-z\s.'-]{1,59}$/),
  body('email').trim().isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 64 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/),
];

export const loginValidator = [
  body('identifier').optional().trim().isLength({ min: 3, max: 120 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 64 }),
];

export const refreshTokenValidator = [body('refreshToken').optional().isString().isLength({ min: 20 })];

export const forgotPasswordValidator = [body('email').trim().isEmail().normalizeEmail()];

export const resetPasswordValidator = [
  body('token').isString().isLength({ min: 20 }),
  body('password')
    .isLength({ min: 8, max: 64 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/),
];

export const verifyEmailValidator = [body('token').isString().isLength({ min: 20 })];
