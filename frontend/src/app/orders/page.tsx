'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { toast } from 'react-hot-toast';
import { getToken } from '@/lib/api';
import Image from 'next/image';
import { FiPackage, FiShoppingBag, FiTruck, FiCheckCircle } from 'react-icons/fi';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

interface OrdersPageProps {
  isAdmin: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PROCESSING':
      return <FiPackage className="w-5 h-5" />;
    case 'SHIPPED':
      return <FiTruck className="w-5 h-5" />;
    case 'DELIVERED':
      return <FiCheckCircle className="w-5 h-5" />;
    default:
      return <FiShoppingBag className="w-5 h-5" />;
  }
};

export default function OrdersPage({ isAdmin: propIsAdmin }: OrdersPageProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('OrdersPage - propIsAdmin:', propIsAdmin);
    
    // Check cookie directly
    const isAdminCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('isAdmin='));
    const cookieIsAdmin = isAdminCookie ? isAdminCookie.split('=')[1] === 'true' : false;
    console.log('OrdersPage - cookieIsAdmin:', cookieIsAdmin);
    
    // Use cookie value if prop is undefined
    setIsAdmin(propIsAdmin ?? cookieIsAdmin);
  }, [propIsAdmin]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('Please login to view your orders');
          setLoading(false);
          return;
        }

        // Fetch orders first
        const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!ordersResponse.ok) {
          if (ordersResponse.status === 401) {
            setError('Your session has expired. Please login again.');
            setLoading(false);
            return;
          }
          const data = await ordersResponse.json();
          throw new Error(data.message || 'Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();
        console.log('Orders data:', ordersData);
        setOrders(ordersData);

        // Only fetch cart if user is not admin
        if (!isAdmin) {
          const cartResponse = await fetch(`${API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!cartResponse.ok) {
            if (cartResponse.status === 401) {
              setError('Your session has expired. Please login again.');
              setLoading(false);
              return;
            }
            const data = await cartResponse.json();
            throw new Error(data.message || 'Failed to fetch cart');
          }

          const cartData = await cartResponse.json();
          console.log('Cart data:', cartData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No orders found</h2>
        {!isAdmin && (
          <Link href="/" className="text-blue-500 hover:underline">
            Continue Shopping
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{isAdmin ? 'All Orders' : 'My Orders'}</h1>
          {!isAdmin && (
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Continue Shopping
            </Link>
          )}
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PROCESSING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{order.status}</span>
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-4">
                      <div className="flex items-center">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 