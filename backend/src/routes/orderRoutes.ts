import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/orderController';
import { auth, adminAuth } from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const updateOrderStatusValidation = [
  body('status')
    .isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status'),
];

// All order routes require authentication
router.use(auth);

// Routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', adminAuth, updateOrderStatusValidation, updateOrderStatus);

export default router; 