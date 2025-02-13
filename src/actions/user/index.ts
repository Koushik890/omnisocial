'use server'

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { findUser } from './queries'
import { createUser, updateSubscription } from './queries'
import { refreshToken } from '@/lib/fetch'
import { updateIntegration } from '../integrations/queries'
import { UserResponse } from '@/types/user'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await delay(delayMs)
      return retryOperation(operation, retries - 1, delayMs)
    }
    throw error
  }
}

export const onCurrentUser = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      console.warn('No user session found')
      return { status: 401 }
    }

    return { status: 200, data: user }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in onCurrentUser:', {
      message: errorMessage,
      timestamp: new Date().toISOString()
    })
    return { status: 500 }
  }
}

export const onBoardUser = async () => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401 }
  }

  // Check if we have all required user data
  if (!user.data.firstName || !user.data.lastName || !user.data.emailAddresses?.[0]?.emailAddress) {
    console.error('Missing required user data:', {
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      email: user.data.emailAddresses?.[0]?.emailAddress
    })
    return { status: 400, error: 'Missing required user data' }
  }

  try {
    const created = await createUser(
      user.data.id,
      user.data.firstName,
      user.data.lastName,
      user.data.emailAddresses[0].emailAddress
    )
    
    return { 
      status: 201, 
      data: created 
    }
  } catch (error) {
    console.error('Error in onBoardUser:', error instanceof Error ? error.message : 'Unknown error');
    return { status: 500 }
  }
}

export const onUserInfo = async (): Promise<UserResponse> => {
  try {
    const user = await onCurrentUser()
    if (user.status !== 200 || !user.data) {
      return { status: 401 }
    }

    const profile = await retryOperation(async () => {
      // First try to find the user
      let result = await findUser(user.data.id)
      
      // If user doesn't exist, try to create them
      if (!result) {
        // Only proceed if we have all required user data
        if (user.data.firstName && user.data.lastName && user.data.emailAddresses?.[0]?.emailAddress) {
          const created = await createUser(
            user.data.id,
            user.data.firstName,
            user.data.lastName,
            user.data.emailAddresses[0].emailAddress
          )
          if (created) {
            // Fetch the complete user profile after creation
            result = await findUser(user.data.id)
          }
        }
      }
      
      if (!result) {
        throw new Error('User not found')
      }
      return result
    })

    if (profile) {
      return { status: 200, data: profile }
    }

    return { status: 404 }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in onUserInfo:', {
      message: errorMessage,
      timestamp: new Date().toISOString()
    })
    return { status: 500 }
  }
}

// export const onSubscribe = async (session_id: string) => {
//   const user = await onCurrentUser()
//   try {
//     const session = await stripe.checkout.sessions.retrieve(session_id)
//     if (session) {
//       const subscribed = await updateSubscription(user.id, {
//         customerId: session.customer as string,
//         plan: 'PRO',
//       })

//       if (subscribed) return { status: 200 }
//       return { status: 401 }
//     }
//     return { status: 404 }
//   } catch (error) {
//     return { status: 500 }
//   }
// }