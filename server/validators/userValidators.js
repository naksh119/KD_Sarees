import { query } from 'express-validator';
import { mongoIdParamValidator } from './productValidators.js';

export const listUsersQueryValidator = [query('role').optional().isIn(['user', 'admin'])];

export const deleteUserParamValidator = [...mongoIdParamValidator];
