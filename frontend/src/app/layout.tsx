'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

interface PageProps {
  isAdmin: boolean;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactElement<PageProps> | React.ReactElement<PageProps>[];
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const isAdminCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('isAdmin='));
      const adminStatus = isAdminCookie ? isAdminCookie.split('=')[1] === 'true' : false;
      console.log('Layout - Admin status:', adminStatus); // Debug log
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
  }, [pathname]);

  // Debug log for children
  console.log('Layout - Children:', children);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<PageProps>(child)) {
      console.log('Layout - Cloning child with isAdmin:', isAdmin); // Debug log
      return React.cloneElement(child, { isAdmin });
    }
    return child;
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar isAdmin={isAdmin} />
        <main className="pt-16">
          <Providers>
            {childrenWithProps}
            <Toaster position="top-right" />
          </Providers>
        </main>
      </body>
    </html>
  );
} 