import { body } from 'express-validator';

export const addToFavoritesValidator = [body('productId').isMongoId()];

export const removeFavoriteItemValidator = [body('productId').isMongoId()];
