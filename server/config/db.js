import mongoose from 'mongoose';

const MONGO_CLUSTER_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'kd_sarees';

export const connectDB = () =>
  mongoose
    .connect(MONGO_CLUSTER_URI, { dbName: MONGO_DB_NAME })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
      console.log('MongoDB connection error:', err.message);
      process.exit(1);
    });
