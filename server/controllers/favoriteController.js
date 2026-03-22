import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const getOrCreateFavorites = async (userId) => {
  let favorites = await Favorite.findOne({ user: userId });
  if (!favorites) favorites = await Favorite.create({ user: userId, items: [] });
  return favorites;
};

export const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await getOrCreateFavorites(req.user._id);
  await favorites.populate('items', 'name price images stock');
  res.json(favorites);
});

export const addToFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Atomic $addToSet avoids lost updates when multiple hearts are clicked in parallel.
  await Favorite.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { items: productId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const favorites = await getOrCreateFavorites(req.user._id);
  await favorites.populate('items', 'name price images stock');
  res.json(favorites);
});

export const removeFavoriteItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  await Favorite.findOneAndUpdate({ user: req.user._id }, { $pull: { items: productId } }, { new: true });

  const favorites = await getOrCreateFavorites(req.user._id);
  await favorites.populate('items', 'name price images stock');
  res.json(favorites);
});
