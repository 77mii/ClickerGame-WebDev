import express from 'express';
import { getShopItems, purchaseItem, getUserItems } from './../controllers/shopController';

const router = express.Router();

// Fetch all shop items
router.get('/shop-items', getShopItems);

// Get user's purchases
router.get('/user-items/:userId', getUserItems);

// Handle item purchase
router.post('/purchase-item', purchaseItem);

export default router;
