import express from 'express';
import {
  getDailyRevenue,
  getTopCustomers,
  getSalesByCategory,
  getOrderStatusDistribution,
  getLowStockProducts,
} from '../controllers/reportController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// All report routes require admin authentication
router.use(auth, adminAuth);

// Routes
router.get('/daily-revenue', getDailyRevenue);
router.get('/top-customers', getTopCustomers);
router.get('/sales-by-category', getSalesByCategory);
router.get('/order-status', getOrderStatusDistribution);
router.get('/low-stock', getLowStockProducts);

export default router; 