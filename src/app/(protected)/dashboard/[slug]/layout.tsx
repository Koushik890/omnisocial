'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/global/sidebar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { use, useState } from 'react';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
      <div className="flex h-screen">
        <Sidebar 
          slug={resolvedParams.slug} 
          onCollapsedChange={setIsSidebarCollapsed}
        />
        <main className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-[104px]" : "lg:ml-[274px]"
        )}>
          <DashboardHeader />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}