import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { auth } from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const updateCartItemValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// All cart routes require authentication
router.use(auth);

// Routes
router.get('/', getCart);
router.post('/', addToCartValidation, addToCart);
router.put('/:itemId', updateCartItemValidation, updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router; 