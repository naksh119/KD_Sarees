import crypto from 'crypto';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\+?[0-9]{10,15}$/.test(phone);
const isValidName = (name) => /^[A-Za-z][A-Za-z\s.'-]{1,59}$/.test(name);
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/.test(password);
const normalizeName = (name) => String(name || '').replace(/\s+/g, ' ').trim();
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizePhone = (phone) => String(phone || '').replace(/[\s-]/g, '').trim();
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || '',
  gender: user.gender || '',
  dateOfBirth: user.dateOfBirth,
  addressLine1: user.addressLine1 || '',
  addressLine2: user.addressLine2 || '',
  city: user.city || '',
  state: user.state || '',
  country: user.country || '',
  pincode: user.pincode || '',
  isEmailVerified: !!user.isEmailVerified,
});

const issueTokens = async (user) => {
  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Please provide name, email, and password');
  if (String(password) !== String(confirmPassword || '')) {
    throw new ApiError(400, 'Password and confirm password must match');
  }

  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);
  if (!isValidName(normalizedName)) throw new ApiError(400, 'Invalid name format');
  if (!isValidEmail(normalizedEmail)) throw new ApiError(400, 'Please provide a valid email address');
  if (!isStrongPassword(String(password))) throw new ApiError(400, 'Password format is weak');

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name: normalizedName, email: normalizedEmail, password });
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationTokenHash = hashToken(verificationToken);
  user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const { accessToken, refreshToken } = await issueTokens(user);

  res.status(201).json({
    message: 'Signup successful. Please verify your email.',
    user: serializeUser(user),
    token: accessToken,
    refreshToken,
    verificationToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, identifier, password } = req.body;
  const loginIdentifier = String(identifier || email || '').trim();
  if (!loginIdentifier || !password) throw new ApiError(400, 'Please provide email/mobile and password');

  const normalizedEmail = normalizeEmail(loginIdentifier);
  const normalizedPhone = normalizePhone(loginIdentifier);
  const isEmailLogin = isValidEmail(normalizedEmail);
  const isPhoneLogin = isValidPhone(normalizedPhone);
  if (!isEmailLogin && !isPhoneLogin) throw new ApiError(400, 'Please provide valid email or mobile');

  const user = isEmailLogin
    ? await User.findOne({ email: normalizedEmail }).select('+password')
    : await User.findOne({ phone: normalizedPhone }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');

  const { accessToken, refreshToken } = await issueTokens(user);
  res.json({ message: 'Login successful', user: serializeUser(user), token: accessToken, refreshToken });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const incoming = req.body.refreshToken || req.cookies?.refreshToken;
  if (!incoming) throw new ApiError(401, 'Refresh token missing');
  const decoded = verifyRefreshToken(incoming);
  const user = await User.findById(decoded.id).select('+refreshTokenHash');
  if (!user || user.refreshTokenHash !== hashToken(incoming)) throw new ApiError(401, 'Invalid refresh token');
  const tokens = await issueTokens(user);
  res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: normalizeEmail(req.body.email) });
  if (!user) return res.json({ message: 'If email exists, reset instructions were generated.' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenHash = hashToken(token);
  user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();
  res.json({ message: 'Reset token generated', resetToken: token });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordTokenHash: hashToken(token),
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select('+password');
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');
  user.password = password;
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    emailVerificationTokenHash: hashToken(req.body.token),
    emailVerificationExpiresAt: { $gt: new Date() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired verification token');
  user.isEmailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpiresAt = null;
  await user.save();
  res.json({ message: 'Email verified successfully' });
});

export const me = asyncHandler(async (req, res) => {
  res.json(serializeUser(req.user));
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, gender, dateOfBirth, addressLine1, addressLine2, city, state, country, pincode } =
    req.body;

  if (name !== undefined) {
    const normalizedName = normalizeName(name);
    if (!isValidName(normalizedName)) throw new ApiError(400, 'Invalid name format');
    req.user.name = normalizedName;
  }
  if (phone !== undefined) {
    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone && !isValidPhone(normalizedPhone)) throw new ApiError(400, 'Invalid phone number');
    if (normalizedPhone) {
      const existingPhoneUser = await User.findOne({ phone: normalizedPhone, _id: { $ne: req.user._id } });
      if (existingPhoneUser) throw new ApiError(409, 'Phone number already in use');
    }
    req.user.phone = normalizedPhone;
  }
  if (gender !== undefined) {
    const allowed = ['male', 'female', 'other', 'prefer_not_to_say', ''];
    if (!allowed.includes(gender)) throw new ApiError(400, 'Invalid gender value');
    req.user.gender = gender;
  }
  if (dateOfBirth !== undefined) {
    if (!dateOfBirth) req.user.dateOfBirth = null;
    else {
      const parsedDate = new Date(dateOfBirth);
      if (Number.isNaN(parsedDate.getTime())) throw new ApiError(400, 'Invalid date of birth');
      req.user.dateOfBirth = parsedDate;
    }
  }
  if (addressLine1 !== undefined) req.user.addressLine1 = String(addressLine1).trim();
  if (addressLine2 !== undefined) req.user.addressLine2 = String(addressLine2).trim();
  if (city !== undefined) req.user.city = String(city).trim();
  if (state !== undefined) req.user.state = String(state).trim();
  if (country !== undefined) req.user.country = String(country).trim();
  if (pincode !== undefined) req.user.pincode = String(pincode).trim();

  const updatedUser = await req.user.save();
  res.json({ message: 'Profile updated successfully', user: serializeUser(updatedUser) });
});
