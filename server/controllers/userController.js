import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Favorite from '../models/Favorite.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const publicUserFields =
  'name email phone role gender dateOfBirth addressLine1 addressLine2 city state country pincode isEmailVerified createdAt updatedAt';

export const listUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = {};
  if (role === 'user' || role === 'admin') {
    filter.role = role;
  }
  const users = await User.find(filter).select(publicUserFields).sort({ createdAt: -1 }).lean();
  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    throw new ApiError(404, 'User not found');
  }
  if (String(target._id) === String(req.user._id)) {
    throw new ApiError(400, 'You cannot delete your own account from here');
  }
  if (target.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot delete the last admin account');
    }
  }

  await Payment.deleteMany({ user: target._id });
  await Order.deleteMany({ user: target._id });
  await Promise.all([
    Cart.deleteOne({ user: target._id }),
    Favorite.deleteOne({ user: target._id }),
    Review.deleteMany({ user: target._id }),
  ]);

  await User.findByIdAndDelete(target._id);
  res.json({ message: 'User deleted' });
});
