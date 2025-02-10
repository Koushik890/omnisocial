import { onUserInfo } from '@/actions/user'
import { QueryClient, QueryFunction } from '@tanstack/react-query'
import { getAllAutomations } from '@/actions/automations'
import { getAutomationInfo } from '@/actions/automations'

const prefetch = async (
    client: QueryClient,
    action: QueryFunction,
    key: string | string[],
    options?: {
      staleTime?: number;
      gcTime?: number;
    }
  ) => {
    return await client.prefetchQuery({
      queryKey: Array.isArray(key) ? key : [key],
      queryFn: action,
      staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
      gcTime: options?.gcTime ?? 30 * 60 * 1000, // 30 minutes
    })
  }

export const PrefetchUserProfile = async (client: QueryClient) => {
  return await prefetch(
    client,
    onUserInfo,
    'user-profile',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}

export const PrefetchUserAutnomations = async (client: QueryClient) => {
  return await prefetch(client, getAllAutomations, 'user-automations')
}

export const PrefetchUserAutomation = async (
  client: QueryClient,
  automationId: string
) => {
  return await prefetch(
    client,
    () => getAutomationInfo(automationId),
    ['automation-info', automationId],
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}