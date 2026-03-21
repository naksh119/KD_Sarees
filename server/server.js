import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import User from './models/User.js';
import { applySecurityMiddleware } from './middlewares/securityMiddleware.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { validateEnv } from './utils/env.js';

const app = express();
const port = process.env.PORT || 8000;
const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || '';
const adminName = (process.env.ADMIN_NAME || 'KD Sarees Admin').trim();

validateEnv();
applySecurityMiddleware(app);

app.get('/', (req, res) => {
  res.json({ message: 'KD Sarees API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use(notFound);
app.use(errorHandler);

const ensureAdminUser = async () => {
  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`Seeded admin user: ${adminEmail}`);
    return;
  }

  existingAdmin.name = adminName;
  existingAdmin.role = 'admin';
  existingAdmin.password = adminPassword;
  existingAdmin.isEmailVerified = true;
  await existingAdmin.save();
  console.log(`Synced admin user credentials: ${adminEmail}`);
};

connectDB()
  .then(async () => {
    await ensureAdminUser();
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
