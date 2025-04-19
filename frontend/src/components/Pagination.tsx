'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  category?: string;
  search?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl,
  category,
  search
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Function to create the URL for a specific page
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or add the page parameter
    params.set('page', pageNumber.toString());
    
    // Add category if provided
    if (category) {
      params.set('category', category);
    }
    
    // Add search if provided
    if (search) {
      params.set('search', search);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      
      if (startPage > 2) {
        pages.push('ellipsis1');
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis2');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="flex items-center space-x-2">
      {/* Previous button */}
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
            : 'bg-white text-indigo-600 hover:bg-indigo-50'
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === 'ellipsis1' || page === 'ellipsis2') {
          return (
            <span key={page} className="px-2 py-1">
              ...
            </span>
          );
        }
        
        return (
          <Link
            key={index}
            href={createPageUrl(page as number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {page}
          </Link>
        );
      })}
      
      {/* Next button */}
      <Link
        href={createPageUrl(currentPage + 1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
            : 'bg-white text-indigo-600 hover:bg-indigo-50'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
} 