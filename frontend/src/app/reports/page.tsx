'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface TopCustomer {
  _id: string;
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
}

interface CategorySales {
  category: string;
  totalSales: number;
  revenue: number;
}

interface OrderStatusCount {
  status: string;
  count: number;
}

interface LowStockProduct {
  _id: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
}

interface ReportData {
  dailyRevenue: DailyRevenue[];
  topCustomers: TopCustomer[];
  salesByCategory: CategorySales[];
  orderStatus: OrderStatusCount[];
  lowStockProducts: LowStockProduct[];
}

export default function ReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    dailyRevenue: [],
    topCustomers: [],
    salesByCategory: [],
    orderStatus: [],
    lowStockProducts: []
  });
  const [dateRange, setDateRange] = useState('30days'); // 7days, 30days, 90days, all
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error('Please login to view reports');
      router.push('/login');
      return;
    }

    fetchAllReports();
  }, [dateRange, router]);

  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Fetch only the reports that are needed
      const [dailyRevenueRes, topCustomersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reports/daily-revenue?range=${dateRange}`, { 
          headers,
          credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/reports/top-customers?range=${dateRange}`, { 
          headers,
          credentials: 'include'
        })
      ]);

      if (!dailyRevenueRes.ok || !topCustomersRes.ok) {
        throw new Error('Failed to fetch reports');
      }

      const [dailyRevenue, topCustomers] = await Promise.all([
        dailyRevenueRes.json(),
        topCustomersRes.json()
      ]);

      setReportData(prev => ({
        ...prev,
        dailyRevenue,
        topCustomers
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      toast.error(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
        
        {/* Date Range Selector */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Date Range</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleDateRangeChange('7days')}
              className={`px-4 py-2 rounded-md ${dateRange === '7days' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Last 7 Days
            </button>
            <button 
              onClick={() => handleDateRangeChange('30days')}
              className={`px-4 py-2 rounded-md ${dateRange === '30days' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Last 30 Days
            </button>
            <button 
              onClick={() => handleDateRangeChange('90days')}
              className={`px-4 py-2 rounded-md ${dateRange === '90days' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Last 90 Days
            </button>
            <button 
              onClick={() => handleDateRangeChange('all')}
              className={`px-4 py-2 rounded-md ${dateRange === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All Time
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Daily Revenue */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Revenue</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.dailyRevenue.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(item.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(item.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Customers</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.topCustomers.map((customer) => (
                        <tr key={customer._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.total_orders}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(customer.total_spent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales by Category</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.salesByCategory.map((category, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.totalSales}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(category.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {reportData.orderStatus.map((status, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      status.status === 'pending' ? 'bg-yellow-50' :
                      status.status === 'processing' ? 'bg-blue-50' :
                      status.status === 'shipped' ? 'bg-indigo-50' :
                      status.status === 'delivered' ? 'bg-green-50' :
                      'bg-red-50'
                    }`}>
                      <h4 className={`text-sm font-medium mb-1 ${
                        status.status === 'pending' ? 'text-yellow-800' :
                        status.status === 'processing' ? 'text-blue-800' :
                        status.status === 'shipped' ? 'text-indigo-800' :
                        status.status === 'delivered' ? 'text-green-800' :
                        'text-red-800'
                      }`}>
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </h4>
                      <p className={`text-2xl font-bold ${
                        status.status === 'pending' ? 'text-yellow-600' :
                        status.status === 'processing' ? 'text-blue-600' :
                        status.status === 'shipped' ? 'text-indigo-600' :
                        status.status === 'delivered' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {status.count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Low Stock Products</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Min Stock Level
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.lowStockProducts.map((product) => (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.currentStock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.minStockLevel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 