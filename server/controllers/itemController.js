/**
 * Example controller: Item resource
 * Handles business logic for item-related API endpoints
 */

/**
 * GET /api/items - List all items (example)
 */
const getItems = (req, res) => {
  // Placeholder: replace with DB query when MongoDB is connected
  const items = [
    { id: 1, name: 'Sample Item 1', description: 'First example item' },
    { id: 2, name: 'Sample Item 2', description: 'Second example item' },
  ];
  res.json({ success: true, data: items });
};

/**
 * GET /api/items/:id - Get single item by id (example)
 */
const getItemById = (req, res) => {
  const { id } = req.params;
  const item = { id: Number(id), name: `Item ${id}`, description: `Description for item ${id}` };
  res.json({ success: true, data: item });
};

module.exports = {
  getItems,
  getItemById,
};
