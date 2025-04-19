export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Validate API URL
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
} 