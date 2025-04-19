import { Request, Response } from 'express';
import { prisma } from '../index';
import { Product } from '../models/Product';

// Get daily revenue for the last 7 days
export const getDailyRevenue = async (req: Request, res: Response) => {
  try {
    const range = req.query.range || '7days';
    const interval = range === '7days' ? '7 days' : 
                    range === '30days' ? '30 days' :
                    range === '90days' ? '90 days' : '365 days';

    const dailyRevenue = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COALESCE(SUM(total)::integer, 0) as revenue,
        COUNT(*)::integer as orders
      FROM "Order"
      WHERE "createdAt" >= NOW() - (${interval}::interval)
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date DESC
    `;

    res.json(dailyRevenue);
  } catch (error) {
    console.error('Get daily revenue error:', error);
    res.status(500).json({ message: 'Error fetching daily revenue' });
  }
};

// Get top customers by total spend
export const getTopCustomers = async (req: Request, res: Response) => {
  try {
    const range = req.query.range || '30days';
    const interval = range === '7days' ? '7 days' : 
                    range === '30days' ? '30 days' :
                    range === '90days' ? '90 days' : '365 days';

    const topCustomers = await prisma.$queryRaw`
      SELECT 
        u.name,
        u.email,
        COUNT(o.id)::integer as total_orders,
        COALESCE(SUM(o.total)::integer, 0) as total_spent
      FROM "User" u
      JOIN "Order" o ON u.id = o."userId"
      WHERE o."createdAt" >= NOW() - (${interval}::interval)
      GROUP BY u.id, u.name, u.email
      ORDER BY total_spent DESC
      LIMIT 5
    `;

    res.json(topCustomers);
  } catch (error) {
    console.error('Get top customers error:', error);
    res.status(500).json({ message: 'Error fetching top customers' });
  }
};

// Get sales by category
export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const range = req.query.range || '30days';
    const daysAgo = range === '7days' ? 7 : 
                    range === '30days' ? 30 :
                    range === '90days' ? 90 : 365;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // First get all order items with their quantities and prices
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate
          }
        }
      },
      select: {
        quantity: true,
        price: true,
        productId: true
      }
    });

    // Get all products from MongoDB to map categories
    const products = await Product.find({}, { category: 1 });
    const productCategories = new Map(products.map(p => [p._id.toString(), p.category]));

    // Aggregate sales by category
    const salesMap = new Map();
    
    for (const item of orderItems) {
      const category = productCategories.get(item.productId) || 'Uncategorized';
      
      if (!salesMap.has(category)) {
        salesMap.set(category, {
          category,
          total_orders: 0,
          total_sales: 0,
          revenue: 0
        });
      }
      
      const stats = salesMap.get(category);
      stats.total_orders += 1;
      stats.total_sales += item.quantity;
      stats.revenue += item.quantity * item.price;
    }

    const salesByCategory = Array.from(salesMap.values())
      .sort((a, b) => b.revenue - a.revenue);

    res.json(salesByCategory);
  } catch (error) {
    console.error('Get sales by category error:', error);
    res.status(500).json({ message: 'Error fetching sales by category' });
  }
};

// Get order status distribution
export const getOrderStatusDistribution = async (req: Request, res: Response) => {
  try {
    const statusDistribution = await prisma.$queryRaw`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total) as total_value
      FROM "Order"
      GROUP BY status
      ORDER BY count DESC
    `;

    // Convert BigInt values to numbers
    const formattedDistribution = (statusDistribution as { status: string; count: bigint; total_value: bigint }[]).map(item => ({
      status: item.status,
      count: Number(item.count),
      total_value: Number(item.total_value)
    }));

    res.json(formattedDistribution);
  } catch (error) {
    console.error('Get order status distribution error:', error);
    res.status(500).json({ message: 'Error fetching order status distribution' });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 10;
    

    const lowStockProducts = await Product.find(
      { stock: { $lte: threshold } },
      {
        name: 1,
        stock: 1,
        minStockLevel: 1
      }
    ).sort({ stock: 1 });

    const formattedProducts = lowStockProducts.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      currentStock: product.stock,
      minStockLevel: product.minStockLevel
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: 'Error fetching low stock products' });
  }
}; 