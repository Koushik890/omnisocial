'use client';

import InfoBar from '@/components/global/infobar'
import { AppSidebar } from '@/components/global/app-sidebar'
import React from 'react'
import { cn } from '@/lib/utils'
import '@/app/globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import { GridPattern } from '@/components/ui/grid-pattern'
import { usePathname } from 'next/navigation'
import { ToastProvider } from '@/contexts/toast-context'

interface ContentProps {
  children: React.ReactNode
  slug: string
}

export const DashboardLayoutContent = ({ children, slug }: ContentProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  const handleSidebarCollapse = React.useCallback((expanded: boolean) => {
    setIsCollapsed(!expanded);
  }, []);

  const showGridPattern = !pathname.includes('/automations/');

  return (
    <ToastProvider>
      <div className="min-h-screen relative">
        <div className="absolute inset-0" style={{ backgroundColor: '#f5f5f5' }} />
        {showGridPattern && (
          <GridPattern 
            className="absolute inset-0 opacity-30 mix-blend-multiply"
            width={24}
            height={24}
            strokeDasharray="2 2"
            style={{
              mask: 'linear-gradient(to bottom, transparent, black)',
              WebkitMask: 'linear-gradient(to bottom, transparent, black)'
            }}
          />
        )}
        <div className="flex min-h-screen relative">
          <div className="fixed left-0 top-0 h-full z-50">
            <SidebarProvider>
              <AppSidebar 
                onCollapse={handleSidebarCollapse}
                defaultExpanded={!isCollapsed}
              />
            </SidebarProvider>
          </div>
          <main 
            className={cn(
              "flex-1 min-h-screen w-full transition-all duration-300",
              isCollapsed ? "pl-[72px]" : "pl-[250px]"
            )}
          >
            <InfoBar slug={slug} />
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}; 