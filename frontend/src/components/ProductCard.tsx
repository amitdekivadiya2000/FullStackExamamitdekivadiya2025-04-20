'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/api';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Check if user is admin from cookie
    const cookies = document.cookie.split(';');
    const isAdminCookie = cookies.find(cookie => cookie.trim().startsWith('isAdmin='));
    const isAdminValue = isAdminCookie ? isAdminCookie.split('=')[1] : 'false';
    setIsAdmin(isAdminValue === 'true');
    
    // Set image source based on available fields
    if (product.image) {
      // Remove /api from the base URL for image paths
      const baseUrl = API_BASE_URL.replace('/api', '');
      // The image field contains only the filename, not the full path
      setImageSrc(`http://localhost:5000/uploads/products/${product.image}`);
    } else if (product.imageUrl) {
      setImageSrc(product.imageUrl);
    } else {
      // Fallback image if no image is available
      setImageSrc('/placeholder-product.jpg');
    }
  }, [product]);

  const addToCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to add to cart');
      }

      toast.success('Added to cart');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageSrc('/placeholder-product.jpg')}
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
      
      {!isAdmin && (
        <div className="p-4 pt-0">
          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
} 