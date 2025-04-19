'use client';

import ProductList from '@/components/ProductList';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
          <p className="text-lg text-gray-600">Discover amazing products at great prices</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <CategoryFilter />
          </div>
          
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <SearchBar />
            </div>
            <ProductList />
          </div>
        </div>
      </div>
    </main>
  );
} 