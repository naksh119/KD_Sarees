import crypto from 'crypto';

const required = ['MONGO_URI'];

export const validateEnv = () => {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required environment variables: JWT_SECRET');
    }

    // Dev-only fallback so local startup doesn't crash without .env.
    process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
    console.warn('[env] JWT_SECRET not set. Generated a temporary dev secret.');
  }

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export const isProduction = process.env.NODE_ENV === 'production';
