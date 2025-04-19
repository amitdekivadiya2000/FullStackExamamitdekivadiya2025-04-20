import { Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id }).populate('items.product') ;
    
    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists and has enough stock
    const productDetails = await Product.findById(productId);
    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productDetails.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user?.id,
        items: [],
      });
    }

    // Check if product already in cart (use updated field name `product`)
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity and price
      existingItem.quantity += quantity;
      existingItem.price = productDetails.price;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productDetails._id, // make sure you're using `product`, not `productId`
        quantity,
        price: productDetails.price,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};


// Update cart item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item in cart
    const cartItem = cart.items.find(
      item => item._id?.toString() === itemId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Validate stock using `product` (not productId)
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Update quantity and price
    cartItem.quantity = quantity;
    cartItem.price = product.price;

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};


// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user?.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      item => item._id?.toString() !== itemId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
}; 