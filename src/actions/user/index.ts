'use server'

import { currentUser } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'
import { createUser, findUser, updateSubscription } from './queries'
import { refreshToken } from '@/lib/fetch'
import { updateIntegration } from '../integrations/queries'


export const onCurrentUser = async () => {
  const user = await currentUser()
  if (!user) return redirect('/sign-in')

  return user
}

export const onBoardUser = async () => {
  const user = await onCurrentUser()
  try {
    const created = await createUser(
      user.id,
      user.firstName!,
      user.lastName!,
      user.emailAddresses[0].emailAddress
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

export const onUserInfo = async () => {
  const user = await onCurrentUser()
  try {
    const profile = await findUser(user.id)
    if (profile) return { status: 200, data: profile }

    return { status: 404 }
  } catch (error) {
    console.error('Error in onUserInfo:', error instanceof Error ? error.message : 'Unknown error');
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