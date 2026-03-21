import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createPaymentForOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { method } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not allowed');
  }

  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: order.totalAmount,
    method,
    status: method === 'cod' ? 'success' : 'created',
  });

  if (method === 'cod') {
    order.paymentStatus = 'paid';
    await order.save();
  }

  res.status(201).json(payment);
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).populate('order', 'status totalAmount').sort({ createdAt: -1 });
  res.json(payments);
});

export const updatePaymentStatusByAdmin = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new ApiError(404, 'Payment not found');

  const { status, gatewayTxnId, failureReason } = req.body;
  payment.status = status;
  if (gatewayTxnId !== undefined) payment.gatewayTxnId = gatewayTxnId;
  if (failureReason !== undefined) payment.failureReason = failureReason;
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    if (status === 'success') order.paymentStatus = 'paid';
    if (status === 'failed') order.paymentStatus = 'failed';
    if (status === 'refunded') order.paymentStatus = 'refunded';
    await order.save();
  }

  res.json(payment);
});
