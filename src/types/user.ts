import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@prisma/client'

export interface UserProfile {
  id: string
  clerkId: string
  firstname: string | null
  lastname: string | null
  email: string | null
  subscription: {
    id: string
    createdAt: Date
    userId: string | null
    plan: SUBSCRIPTION_PLAN
    updatedAt: Date
    customerId: string | null
    lemonSqueezyCustomerPortalUrl: string | null
    subscriptionStatus: SUBSCRIPTION_STATUS | null
  } | null
  integrations: Array<{
    id: string
    token: string
    expiresAt: Date | null
    name: 'INSTAGRAM'
  }>
}

export interface ApiResponse<T> {
  status: number
  data?: T
  error?: string
}

export type UserResponse = ApiResponse<UserProfile> 