/**
 * Example: Item API calls (uses backend /api/items)
 */

import { apiRequest } from './api';

export async function getItems() {
  return apiRequest('/api/items');
}

export async function getItemById(id) {
  return apiRequest(`/api/items/${id}`);
}
