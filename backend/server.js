/**
 * Main entry point - Node.js + Express server
 * Run: node server.js  or  npm run dev
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const itemRoutes = require('./routes/itemRoutes');

// const connectDB = require('./config/db'); // Uncomment when using MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (e.g. uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes (example)
app.use('/api/items', itemRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server (without DB for now)
// connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
// });

module.exports = app;
