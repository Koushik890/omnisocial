'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Settings, 
  Users, 
  MessageSquare, 
  BarChart2, 
  Zap,
  Calendar,
  Bell
} from 'lucide-react'

interface SidebarItem {
  name: string
  href: string
  icon: React.ElementType
}

const items: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart2
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare
  },
  {
    name: 'Automations',
    href: '/automations',
    icon: Zap
  },
  {
    name: 'Schedule',
    href: '/schedule',
    icon: Calendar
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export default function Items() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname.includes(item.href)

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive 
                ? 'bg-gray-100/80 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon 
              className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-gray-900' : 'text-gray-500'
              )} 
              strokeWidth={1.5}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
