import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const getProductSnapshot = (product) => ({
  priceAtAddTime: product.price,
  productName: product.name || '',
  productDescription: product.description || '',
  productImage: product.images?.[0] || '',
  productCategory: product.category || null,
});

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.product', 'name price images stock');
  res.json(cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Requested quantity exceeds stock');

  const cart = await getOrCreateCart(req.user._id);
  const idx = cart.items.findIndex((item) => String(item.product) === String(productId));
  if (idx >= 0) {
    cart.items[idx].quantity += Number(quantity);
    Object.assign(cart.items[idx], getProductSnapshot(product));
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      ...getProductSnapshot(product),
    });
  }
  await cart.save();
  await cart.populate('items.product', 'name price images stock');
  res.json(cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Requested quantity exceeds stock');

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((x) => String(x.product) === String(productId));
  if (!item) throw new ApiError(404, 'Item not found in cart');
  item.quantity = Number(quantity);
  Object.assign(item, getProductSnapshot(product));
  await cart.save();
  await cart.populate('items.product', 'name price images stock');
  res.json(cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId || req.body.productId;
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => String(item.product) !== String(productId));
  await cart.save();
  await cart.populate('items.product', 'name price images stock');
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ message: 'Cart cleared' });
});
