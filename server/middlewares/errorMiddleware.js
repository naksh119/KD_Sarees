import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  if (err?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate data detected', key: err.keyPattern });
  }

  if (err?.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err?.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const payload = {
    message: err?.message || 'Internal server error',
  };

  if (err instanceof ApiError && err.details) {
    payload.errors = err.details;
  }

  return res.status(statusCode).json(payload);
};
