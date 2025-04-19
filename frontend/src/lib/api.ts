import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

// Token management functions
const getToken = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
  return null;
};

const setToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=604800`; // 7 days
    } else {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
};

const setIsAdmin = (isAdmin: boolean) => {
  if (typeof window !== 'undefined') {
    if (isAdmin) {
      document.cookie = 'isAdmin=true; path=/; max-age=604800'; // 7 days
    } else {
      document.cookie = 'isAdmin=false; path=/; max-age=604800'; // 7 days
    }
  }
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically redirect on 401 errors
    // Let the components handle the error themselves
    return Promise.reject(error);
  }
);

export { getToken, setToken, setIsAdmin };
export default api; 