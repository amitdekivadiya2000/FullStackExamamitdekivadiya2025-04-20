import { DailyRevenue, TopCustomer, SalesByCategory, OrderStatusDistribution, LowStockProduct } from '../types';
// import { handleApiError } from '../utils/error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchDailyRevenue(): Promise<DailyRevenue[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/daily-revenue`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await handleApiError(response);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchTopCustomers(): Promise<TopCustomer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/top-customers`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await handleApiError(response);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchSalesByCategory(): Promise<SalesByCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/sales-by-category`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await handleApiError(response);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchOrderStatusDistribution(): Promise<OrderStatusDistribution[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/order-status`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await handleApiError(response);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchLowStockProducts(): Promise<LowStockProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/low-stock`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await handleApiError(response);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
} 

function handleApiError(response: Response) {
  throw new Error('Error'+ response);
}
