import express from 'express';
import { getShopItems, purchaseItem } from './../controllers/shopController';

const router = express.Router();

// Fetch all shop items
router.get('/shop-items', getShopItems);

// Handle item purchase
router.post('/purchase-item', purchaseItem);

export default router;