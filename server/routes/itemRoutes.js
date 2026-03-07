/**
 * Example API routes: /api/items
 * Mounted in server.js as app.use('/api/items', itemRoutes)
 */

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET /api/items - List all items
router.get('/', itemController.getItems);

// GET /api/items/:id - Get single item
router.get('/:id', itemController.getItemById);

module.exports = router;
