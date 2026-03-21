import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { isProduction } from '../utils/env.js';

const parseAllowedOrigins = () => {
  const configuredOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://kdsarees.netlify.app',
  ];

  return [...new Set([...defaultOrigins, ...configuredOrigins])];
};

const allowedOrigins = parseAllowedOrigins();
let hasLoggedAllowedOrigins = false;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
};

const sanitizeMongoPayload = (value) => {
  if (!value || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    value.forEach((item) => sanitizeMongoPayload(item));
    return;
  }

  Object.keys(value).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      delete value[key];
      return;
    }

    sanitizeMongoPayload(value[key]);
  });
};

export const applySecurityMiddleware = (app) => {
  if (!hasLoggedAllowedOrigins) {
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none configured)'}`);
    hasLoggedAllowedOrigins = true;
  }

  const corsOptions = {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`[CORS] Blocked origin: ${origin || '(no origin header)'}`);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  };

  app.use(helmet());
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(cookieParser());
  // Allow review image payloads (base64 data URLs) while keeping a bounded request size.
  app.use(express.json({ limit: '5mb' }));
  app.use((req, _res, next) => {
    // Express 5 makes req.query getter-only, so sanitize nested values in-place.
    sanitizeMongoPayload(req.body);
    sanitizeMongoPayload(req.params);
    sanitizeMongoPayload(req.query);
    next();
  });
  app.use((req, _res, next) => {
    if (typeof req.body === 'object' && req.body !== null) {
      req.body = JSON.parse(JSON.stringify(req.body).replace(/[<>]/g, ''));
    }
    next();
  });
  app.use(morgan(isProduction ? 'combined' : 'dev'));
};
