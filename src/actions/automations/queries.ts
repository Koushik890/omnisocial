'use server'

import { client } from '@/lib/prisma'
import { v4 } from 'uuid'

export const createAutomation = async (clerkId: string, id?: string) => {
  const newId = id || v4();
  const result = await client.user.update({
    where: {
      clerkId,
    },
    data: {
      automations: {
        create: {
          id: newId,
          name: 'Untitled'
        },
      },
    },
    select: {
      automations: {
        where: {
          id: newId
        }
      }
    }
  });
  
  return result.automations[0];
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

export const addTrigger = async (automationId: string, trigger: string[]) => {
  if (trigger.length === 2) {
    return await client.automation.update({
      where: { id: automationId },
      data: {
        trigger: {
          createMany: {
            data: [{ type: trigger[0] }, { type: trigger[1] }],
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
