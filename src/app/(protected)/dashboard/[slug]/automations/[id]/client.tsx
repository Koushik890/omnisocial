'use client';

import React from 'react'
import { useParams } from 'next/navigation'
import AutomationsBreadCrumb from '@/components/global/bread-crumbs/automations'
import FlowBuilder from '@/components/global/automations/flow-builder'

interface AutomationClientProps {
  id: string
}

export const AutomationClient: React.FC<AutomationClientProps> = ({ id }) => {
  const [sidebarWidth, setSidebarWidth] = React.useState<number>(250)

  React.useEffect(() => {
    // Check initial sidebar state
    const sidebar = document.querySelector('aside') as HTMLElement
    if (sidebar) {
      setSidebarWidth(sidebar.offsetWidth)
    }

    const handleSidebarChange = (event: CustomEvent<{ collapsed: boolean }>) => {
      setSidebarWidth(event.detail.collapsed ? 72 : 250)
    }

    // Add event listener
    window.addEventListener('sidebarStateChange', handleSidebarChange as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarChange as EventListener)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Header */}
      <AutomationsBreadCrumb id={id} />

      {/* Main Content */}
      <div 
        className="absolute inset-0 mt-[70px] transition-[margin-left] duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <FlowBuilder id={id} />
      </div>
    </div>
  )
} 