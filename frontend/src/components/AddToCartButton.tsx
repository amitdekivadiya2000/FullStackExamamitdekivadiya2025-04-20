'use client';

import { Product } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addToCart = async () => {
    try {
      setLoading(true);
      await api.post('/cart', {
        productId: product._id,
        quantity,
      });
      toast.success('Added to cart');
    } catch (error) {
      if ((error as any).response?.status === 401) {
        router.push('/login');
      } else {
        toast.error('Failed to add to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="font-medium">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="input w-24"
          disabled={product.stock === 0}
        >
          {[...Array(Math.min(10, product.stock))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={addToCart}
        disabled={loading || product.stock === 0}
        className={`btn w-full ${
          product.stock > 0
            ? 'btn-primary'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding to Cart...
          </span>
        ) : product.stock > 0 ? (
          'Add to Cart'
        ) : (
          'Out of Stock'
        )}
      </button>
    </div>
  );
} 