import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const productIds = cart.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const items = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = productMap.get(String(item.product));
    if (!product) throw new ApiError(400, 'One or more products are no longer available');
    if (product.stock < item.quantity) throw new ApiError(400, `${product.name} is out of stock`);
    product.stock -= item.quantity;
    await product.save();
    const price = product.price;
    items.push({ product: product._id, quantity: item.quantity, price });
    totalAmount += price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress,
    status: 'pending',
    paymentStatus: 'pending',
  });

  cart.items = [];
  await cart.save();
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name price images')
    .sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name price images');
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not allowed');
  }
  res.json(order);
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .sort({ createdAt: -1 });
  const orderIds = orders.map((o) => o._id);
  const payments = await Payment.find({ order: { $in: orderIds } })
    .select('order status method amount')
    .sort({ createdAt: -1 });
  const latestByOrder = new Map();
  for (const p of payments) {
    const key = String(p.order);
    if (!latestByOrder.has(key)) {
      latestByOrder.set(key, p);
    }
  }
  const payload = orders.map((o) => {
    const doc = o.toObject();
    const pay = latestByOrder.get(String(o._id));
    doc.latestPayment = pay
      ? { _id: pay._id, status: pay.status, method: pay.method, amount: pay.amount }
      : null;
    return doc;
  });
  res.json(payload);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(order);
});
