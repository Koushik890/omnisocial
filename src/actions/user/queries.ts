'use server'

import { client } from '@/lib/prisma'

export const findUser = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      subscription: true,
      integrations: {
        select: {
          id: true,
          token: true,
          expiresAt: true,
          name: true,
        },
      },
    },
  })
}

export const createUser = async (
  clerkId: string,
  firstname: string,
  lastname: string,
  email: string
) => {
  return await client.user.create({
    data: {
      clerkId,
      firstname,
      lastname,
      email,
      subscription: {
        create: {},
      },
    },
    select: {
      firstname: true,
      lastname: true,
    },
  })
}

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: 'PRO' | 'FREE' }
) => {
  const user = await client.user.findUnique({
    where: { clerkId },
    include: { subscription: true }
  })

  if (!user) {
    console.error('User not found:', clerkId)
    throw new Error('User not found')
  }

  // If subscription doesn't exist, create it
  if (!user.subscription) {
    return await client.user.update({
      where: { clerkId },
      data: {
        subscription: {
          create: {
            customerId: props.customerId,
            plan: props.plan
          }
        }
      }
    })
  }

  // If subscription exists, update it
  return await client.user.update({
    where: { clerkId },
    data: {
      subscription: {
        update: {
          data: props
        }
      }
    }
  })
}

