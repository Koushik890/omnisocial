import InfoBar from '@/components/global/infobar'
import { Sidebar } from '@/components/global/sidebar'
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import {
  PrefetchUserAutnomations,
  PrefetchUserProfile
} from '../../../../react-query/prefetch'
import React from 'react'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

const DashboardLayout = async ({ children, params }: Props) => {
  // Query
  const query = new QueryClient()
  const { slug } = await params

  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug parameter')
  }

  await PrefetchUserProfile(query)
  await PrefetchUserAutnomations(query)

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
        <div className="flex h-screen">
          <Sidebar slug={slug} />
          <main className={cn(
            "flex-1 flex flex-col overflow-hidden transition-all duration-300",
            "lg:ml-[274px]"
          )}>
            <InfoBar slug={slug} />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="container mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default DashboardLayout