import { client } from '@/lib/prisma'
import { ACTION_TYPE, Prisma } from '@prisma/client'

export const matchKeyword = async (text: string) => {
  const keywords = await client.keyword.findMany({
    select: {
      id: true,
      word: true,
      triggerId: true
    }
  })

  const match = keywords.find(keyword => 
    text.toLowerCase().includes(keyword.word.toLowerCase())
  )

  return match || null
}

export const getKeywordAutomation = async (
  automationId: string,
  dm: boolean
) => {
  try {
    // Validate if the ID is in the correct format
    if (!automationId || typeof automationId !== 'string') {
      console.error('Invalid automation ID:', automationId)
      return null
    }

    // Check if the ID is in the correct CUID format
    // CUID format: c[a-z0-9]{24}
    const cuidRegex = /^c[a-z0-9]{24}$/
    if (!cuidRegex.test(automationId)) {
      console.warn('Automation ID is not in CUID format:', automationId)
      // Don't return null here, try to fetch anyway as it might be a different ID format
    }

    return await client.automation.findFirst({
      where: {
        trigger: {
          some: {
            id: automationId
          }
        }
      },
      include: {
        trigger: {
          where: {
            type: dm ? 'user-message' : 'post-comments',
          },
          include: {
            posts: true,
            keywords: true,
            replyMessages: true
          }
        },
        listener: true,
        User: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
            integrations: {
              select: {
                token: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error('Error in getKeywordAutomation:', error)
    return null
  }
}

export const getKeywordPost = async (
  postId: string,
  automationId: string
) => {
  return await client.post.findFirst({
    where: {
      postId,
      trigger: {
        automationId
      }
    }
  })
}

export const createChatHistory = async (
  automationId: string,
  recipientId: string,
  senderId: string,
  message: string
) => {
  return client.dms.create({
    data: {
      automationId,
      reciever: recipientId,
      senderId,
      message
    }
  })
}

export const getChatHistory = async (
  recipientId: string,
  senderId: string
) => {
  const history = await client.dms.findMany({
    where: {
      reciever: recipientId,
      senderId
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return {
    history: history.map(h => ({
      role: h.senderId === recipientId ? 'user' : 'assistant',
      content: h.message || ''
    })),
    automationId: history[0]?.automationId
  }
}

export const trackResponses = async (
  automationId: string,
  type: 'DM' | 'COMMENT'
) => {
  const automation = await client.automation.findUnique({
    where: { id: automationId },
    include: { listener: true }
  })

  if (!automation?.listener) return false

  const updateData = type === 'DM' 
    ? { dmCount: (automation.listener.dmCount || 0) + 1 }
    : { commentCount: (automation.listener.commentCount || 0) + 1 }

  await client.listener.update({
    where: { id: automation.listener.id },
    data: updateData
  })

  return true
}

export const getRandomReplyMessage = async (triggerId: string): Promise<string | null> => {
  try {
    const replyMessages = await client.replyMessage.findMany({
      where: {
        triggerId
      },
      select: {
        message: true
      }
    })

    if (!replyMessages.length) {
      console.log('No reply messages found for trigger:', triggerId)
      return null
    }

    const randomIndex = Math.floor(Math.random() * replyMessages.length)
    return replyMessages[randomIndex].message
  } catch (error) {
    console.error('Error getting random reply message:', error)
    return null
  }
}