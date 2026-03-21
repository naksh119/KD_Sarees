import { Router } from 'express';
import {
  createOffer,
  deleteOffer,
  getActiveOffers,
  getAllOffers,
  updateOffer,
} from '../controllers/offerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getActiveOffers);
router.get('/all', protect, adminOnly, getAllOffers);
router.post('/', protect, adminOnly, createOffer);
router.put('/:id', protect, adminOnly, updateOffer);
router.delete('/:id', protect, adminOnly, deleteOffer);

export default router;
