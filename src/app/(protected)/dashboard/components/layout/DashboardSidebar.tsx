'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Bot,
  Settings,
  ChevronRight,
  Layers,
  LogOut
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const navItems = [
  { 
    href: '/dashboard', 
    label: 'Overview',
    icon: LayoutDashboard
  },
  { 
    href: '/dashboard/automations', 
    label: 'Automations',
    icon: Bot
  },
  { 
    href: '/dashboard/integrations', 
    label: 'Integrations',
    icon: Layers
  },
  { 
    href: '/dashboard/settings', 
    label: 'Settings',
    icon: Settings
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={cn(
      "relative flex flex-col bg-gradient-to-br from-[#A288F7]/90 to-[#F7C1E4]/30 backdrop-blur-lg border border-white/20 transition-all duration-300 ease-in-out rounded-3xl m-2",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "flex h-20 px-4 transition-all duration-300 ease-in-out",
        isCollapsed ? "items-center" : "items-center justify-center"
      )}>
        <Link href="/dashboard" className="flex items-center transition-all duration-300 ease-in-out">
          <Logo collapsed={isCollapsed} />
        </Link>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-[#8D4AF3] hover:text-[#A288F7] shadow-lg border border-white/50"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed ? "rotate-0" : "rotate-180"
          )} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/80 text-[#8D4AF3] shadow-sm"
                    : "text-[#2D2D2D] hover:text-[#8D4AF3] hover:bg-white/50"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="px-3 pb-4">
        <button
          className="w-full flex items-center px-3 py-2 rounded-xl text-sm font-medium text-[#2D2D2D] hover:text-[#8D4AF3] hover:bg-white/50 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Sign out</span>}
        </button>
      </div>
    </div>
  );
}