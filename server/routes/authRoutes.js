import { Router } from 'express';
import {
  register,
  login,
  me,
  updateMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiters.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from '../validators/authValidators.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/signup', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/refresh-token', refreshTokenValidator, validateRequest, refreshToken);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validateRequest, resetPassword);
router.post('/verify-email', verifyEmailValidator, validateRequest, verifyEmail);
router.get('/me', protect, me);
router.put('/me', protect, updateMe);

export default router;
