import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { isProduction } from '../utils/env.js';

// Parse allowed origins from ENV + defaults
const parseAllowedOrigins = () => {
  const configuredOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://kdsarees.netlify.app',
  ];

  return [...new Set([...defaultOrigins, ...configuredOrigins])];
};

const allowedOrigins = parseAllowedOrigins();
let hasLoggedAllowedOrigins = false;

// Check if origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // allow Postman / server calls
  return allowedOrigins.includes(origin);
};

// Prevent Mongo injection
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
  // Log allowed origins once
  if (!hasLoggedAllowedOrigins) {
    console.log(
      `[CORS] Allowed origins: ${
        allowedOrigins.join(', ') || '(none configured)'
      }`
    );
    hasLoggedAllowedOrigins = true;
  }

  // ✅ CORS options
  const corsOptions = {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(
          `[CORS] Blocked origin: ${origin || '(no origin header)'}`
        );
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  // ✅ Order matters
  app.use(helmet());
  app.use(cors(corsOptions));

  // ✅ FIXED preflight (IMPORTANT)
  app.options(/.*/, cors(corsOptions));

  app.use(cookieParser());

  // Body parser
  app.use(express.json({ limit: '5mb' }));

  // Mongo sanitize
  app.use((req, _res, next) => {
    sanitizeMongoPayload(req.body);
    sanitizeMongoPayload(req.params);
    sanitizeMongoPayload(req.query);
    next();
  });

  // Basic XSS sanitize
  app.use((req, _res, next) => {
    if (typeof req.body === 'object' && req.body !== null) {
      req.body = JSON.parse(
        JSON.stringify(req.body).replace(/[<>]/g, '')
      );
    }
    next();
  });

  // Logger
  app.use(morgan(isProduction ? 'combined' : 'dev'));
};