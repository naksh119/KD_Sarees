import { Router } from 'express';
import { addToFavorites, getMyFavorites, removeFavoriteItem } from '../controllers/favoriteController.js';
import { securePrivate } from '../middlewares/secureRoute.js';
import { addToFavoritesValidator, removeFavoriteItemValidator } from '../validators/favoriteValidators.js';

const router = Router();

router.get('/', ...securePrivate({ roles: ['user', 'admin'] }), getMyFavorites);
router.post('/add', ...securePrivate({ roles: ['user', 'admin'], validators: addToFavoritesValidator }), addToFavorites);
router.delete('/item', ...securePrivate({ roles: ['user', 'admin'], validators: removeFavoriteItemValidator }), removeFavoriteItem);

export default router;
