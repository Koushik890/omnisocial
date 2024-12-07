'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { DashboardSidebar } from './components/layout/DashboardSidebar';
import { DashboardHeader } from './components/layout/DashboardHeader';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
      <div className="flex h-screen">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}