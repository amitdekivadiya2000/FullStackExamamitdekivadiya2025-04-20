import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  searchProducts,
} from '../controllers/productController';
import { auth, adminAuth } from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const productValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', auth, adminAuth, productValidation, createProduct);
router.put('/:id', auth, adminAuth, productValidation, updateProduct);
router.delete('/:id', auth, adminAuth, deleteProduct);

export default router; 