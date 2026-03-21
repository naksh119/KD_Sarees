import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from './validateRequest.js';

export const securePublic = (...validators) => [...validators, validateRequest];

export const securePrivate = ({ roles = [], validators = [] } = {}) => {
  const stack = [protect];
  if (roles.length) stack.push(authorize(...roles));
  return [...stack, ...validators, validateRequest];
};
