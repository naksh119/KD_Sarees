import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter).populate('category', 'name slug');
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const { products } = req.body;
  const created = [];
  const errors = [];

  for (let i = 0; i < products.length; i += 1) {
    const raw = products[i];
    const doc = {
      name: typeof raw.name === 'string' ? raw.name.trim() : raw.name,
      price: Number(raw.price),
      category: raw.category,
      stock: raw.stock != null && raw.stock !== '' ? Number(raw.stock) : 0,
      description:
        typeof raw.description === 'string' ? raw.description.trim() : raw.description || '',
      images: Array.isArray(raw.images) ? raw.images.map((u) => String(u).trim()).filter(Boolean) : [],
    };

    try {
      const product = await Product.create(doc);
      created.push({ _id: product._id, name: product.name });
    } catch (err) {
      errors.push({
        index: i,
        message: err.message || 'Failed to create product',
      });
    }
  }

  if (created.length === 0) {
    return res.status(400).json({
      message: 'No products were created.',
      createdCount: 0,
      failedCount: errors.length,
      errors,
    });
  }

  const statusCode = errors.length > 0 ? 207 : 201;
  return res.status(statusCode).json({
    message:
      errors.length > 0
        ? `Created ${created.length} product(s); ${errors.length} failed.`
        : `Created ${created.length} product(s).`,
    createdCount: created.length,
    failedCount: errors.length,
    errors,
    created,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ message: 'Product removed' });
});
