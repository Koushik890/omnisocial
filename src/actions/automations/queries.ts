'use server'

import { client } from '@/lib/prisma'
import { v4 } from 'uuid'

export const createAutomation = async (clerkId: string, id?: string) => {
  const newId = id || v4();
  try {
    // First find the user to ensure they exist
    const user = await client.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Create the automation with all required fields
    const automation = await client.automation.create({
      data: {
        id: newId,
        name: 'Untitled',
        active: false,
        userId: user.id
      },
      // Include essential relations in the response
      include: {
        User: {
          select: {
            subscription: true
          }
        }
      }
    });
    
    if (!automation) {
      throw new Error('Failed to create automation');
    }
    
    return automation;
  } catch (error) {
    console.error('Error creating automation:', error);
    if (error instanceof Error && error.message === 'User not found') {
      throw new Error('User not found in database');
    }
    throw new Error('Failed to create automation');
  }
}

export const getAutomations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      automations: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  })
}

export const findAutomation = async (id: string) => {
  return await client.automation.findUnique({
    where: {
      id,
    },
    include: {
      keywords: true,
      trigger: true,
      posts: true,
      listener: true,
      User: {
        select: {
          subscription: true,
          integrations: true,
        },
      },
    },
  })
}

export const updateAutomation = async (
  id: string,
  update: {
    name?: string
    active?: boolean
  }
) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid automation ID');
  }

  if (!update || typeof update !== 'object') {
    throw new Error('Invalid update payload');
  }

  try {
    const data: Record<string, any> = {};
    
    if (update.name !== undefined) {
      if (typeof update.name !== 'string') {
        throw new Error('Name must be a string');
      }
      data.name = update.name.trim();
    }
    
    if (update.active !== undefined) {
      if (typeof update.active !== 'boolean') {
        throw new Error('Active must be a boolean');
      }
      data.active = update.active;
    }

    const result = await client.automation.update({
      where: { id },
      data
    });

    if (!result) {
      throw new Error('Failed to update automation');
    }

    return result;
  } catch (error) {
    console.error('Error in updateAutomation:', error);
    throw error;
  }
}

export const addListener = async (
  automationId: string,
  listener: 'OMNIAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      listener: {
        create: {
          listener,
          prompt,
          commentReply: reply,
        },
      },
    },
  })
}

export const deleteTrigger = async (automationId: string) => {
  try {
    // First delete all existing triggers for this automation
    await client.trigger.deleteMany({
      where: {
        automationId
      }
    })

    // Update the automation to reflect the trigger removal
    return await client.automation.update({
      where: {
        id: automationId
      },
      data: {
        trigger: {
          deleteMany: {} // This ensures all triggers are removed from the relation
        }
      },
      include: {
        trigger: true
      }
    })
  } catch (error) {
    console.error('Error deleting trigger:', error)
    throw error
  }
}

export const addTrigger = async (automationId: string, trigger: string[], config?: Record<string, any>) => {
  // If trigger array is empty, use the dedicated delete function
  if (trigger.length === 0) {
    return await deleteTrigger(automationId)
  }

  const configData = config ? { config } : {}
  
  // First, delete any existing triggers
  await client.trigger.deleteMany({
    where: {
      automationId
    }
  })

  // Then create the new trigger(s)
  if (trigger.length === 2) {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        trigger: {
          createMany: {
            data: [
              { type: trigger[0], ...configData },
              { type: trigger[1], ...configData }
            ],
          },
        },
      },
    })
  }
  
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      trigger: {
        create: {
          type: trigger[0],
          ...configData
        },
      },
    },
  })
}

export const addKeyWord = async (automationId: string, keyword: string) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      keywords: {
        create: {
          word: keyword,
        },
      },
    },
  })
}

export const deleteKeywordQuery = async (id: string) => {
  return client.keyword.delete({
    where: { id },
  })
}

export const addPost = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }[]
) => {
  return await client.automation.update({
    where: {
      id: autmationId,
    },
    data: {
      posts: {
        createMany: {
          data: posts,
        },
      },
    },
  })
}

export const deleteAutomationQuery = async (id: string) => {
  return await client.automation.delete({
    where: { id },
  })
}
