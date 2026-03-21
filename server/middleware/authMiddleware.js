import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    token = auth.slice(7);
  }
  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }
  const decoded = verifyAccessToken(token);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user) {
    throw new ApiError(401, 'User not found');
  }
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    throw new ApiError(403, 'Forbidden: insufficient permissions');
  }
  next();
};

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  next();
};
