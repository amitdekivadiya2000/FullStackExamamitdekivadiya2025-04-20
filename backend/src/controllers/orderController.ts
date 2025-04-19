import { Request, Response } from 'express';
import { prisma } from '../index';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

// Create order from cart
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user?.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log(cart,'cart')  

    // Validate stock and calculate total
    let total = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.product} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for product ${product.name}` 
        });
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: item.product.toString(),
        quantity: item.quantity,
        price: product.price,
      });

      // Prepare stock update
      stockUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    // Create order in PostgreSQL
    const order = await prisma.order.create({
      data: {
        userId: req.user?.id as string,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Update product stock in MongoDB
    await Product.bulkWrite(stockUpdates);

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user?.id });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get user's orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    // Step 1: Get orders from PostgreSQL
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Step 2: Collect all unique productIds from order items
    const productIds = Array.from(
      new Set(orders.flatMap(order => order.items.map(item => item.productId)))
    );

    // Step 3: Fetch product details from MongoDB
    const products = await Product.find({
      _id: { $in: productIds },
    });

    // Create a map for easy lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    // Step 4: Attach product info to each item
    const ordersWithProductDetails = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: productMap.get(item.productId),
      })),
    }));

    res.json(ordersWithProductDetails);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};


// Get single order
export const getOrder = async (req: Request, res: Response) => {
  try {
    // Step 1: Get the order from PostgreSQL
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Step 2: Check if order belongs to user
    if (order.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Step 3: Extract productIds
    const productIds = order.items.map(item => item.productId);

    // Step 4: Fetch product details from MongoDB
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    // Step 5: Attach product data to items
    const enrichedOrder = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: productMap.get(item.productId),
      })),
    };

    res.json(enrichedOrder);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};


// Update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    console.log('Order ID:', orderId);
    console.log('New Status:', status);

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
}; 