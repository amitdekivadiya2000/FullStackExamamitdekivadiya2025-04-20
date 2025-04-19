export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  image?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyRevenue {
  date: string;
  orders: number;
  revenue: number;
}

export interface TopCustomer {
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
}

export interface SalesByCategory {
  category: string;
  totalProducts: number;
  averagePrice: number;
  totalStock: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  total_value: number;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
} 