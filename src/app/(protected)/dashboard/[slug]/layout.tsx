import { DashboardLayoutContent } from './layout-content'
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import {
  PrefetchUserAutnomations,
  PrefetchUserProfile
} from '../../../../react-query/prefetch'
import React from 'react'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

const DashboardLayout = async ({ children, params }: Props) => {
  const query = new QueryClient()
  const resolvedParams = await params
  const { slug } = resolvedParams

  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug parameter')
  }

  await PrefetchUserProfile(query)
  await PrefetchUserAutnomations(query)

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <DashboardLayoutContent slug={slug}>
        {children}
      </DashboardLayoutContent>
    </HydrationBoundary>
  )
}

export default DashboardLayout