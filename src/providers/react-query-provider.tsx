'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

type Props = { children: React.ReactNode }

export default function ReactQueryProvider({ children }: Props) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic background refetching
        refetchOnWindowFocus: false,
        // Don't retry on failure
        retry: false,
        // Keep data for 5 minutes
        staleTime: 5 * 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}