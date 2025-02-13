'use server'

import { onCurrentUser } from '../user'
import { findUser } from '../user/queries'
import {
  addKeyWord,
  addListener,
  addPost,
  addTrigger,
  createAutomation,
  deleteKeywordQuery,
  deleteAutomationQuery,
  findAutomation,
  getAutomations,
  updateAutomation,
  deleteTrigger,
} from './queries'

export const createAutomations = async (id?: string) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    // First find the user in our database
    const dbUser = await findUser(user.data.id)
    if (!dbUser) {
      return { status: 404, data: 'User not found in database' }
    }

    const automation = await createAutomation(dbUser.clerkId, id)
    if (automation) {
      return { 
        status: 200, 
        data: 'Automation created', 
        res: automation 
      }
    }

    return { status: 404, data: 'Oops! something went wrong' }
  } catch (error) {
    console.error('Error in createAutomations:', error);
    return { status: 500, data: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export const getAllAutomations = async () => {
  try {
    const user = await onCurrentUser()
    if (user.status !== 200 || !user.data) {
      return { status: 401, data: [] }
    }

    // Find user in database
    const dbUser = await findUser(user.data.id)
    if (!dbUser) {
      return { status: 404, data: [] }
    }

    const result = await getAutomations(user.data.id)
    if (!result || !result.automations) {
      return { status: 404, data: [] }
    }

    const transformedAutomations = result.automations.map(automation => ({
      id: automation.id,
      name: automation.name || 'Untitled',
      runs: automation.listener ? (automation.listener.dmCount + automation.listener.commentCount) : 0,
      status: automation.active ? 'Live' : 'Draft',
      lastPublished: automation.updatedAt ? new Date(automation.updatedAt).toLocaleDateString() : 'Never',
      active: automation.active
    }))

    return { status: 200, data: transformedAutomations }
  } catch (error) {
    console.error('Error in getAllAutomations:', error)
    return { status: 500, data: [] }
  }
}

export const getAutomationInfo = async (id: string) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401 }
  }

  try {
    const automation = await findAutomation(id)
    if (automation) return { status: 200, data: automation }

    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}

export const updateAutomationName = async (
  automationId: string,
  data: {
    name?: string
    active?: boolean
    automation?: string
  }
) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    if (!data || typeof data !== 'object') {
      console.error('Invalid data payload:', { automationId, data });
      return { status: 400, data: 'Invalid data payload' };
    }

    if (!data.name || typeof data.name !== 'string') {
      console.error('Invalid name in payload:', { automationId, data });
      return { status: 400, data: 'Name is required and must be a string' };
    }

    const update = await updateAutomation(automationId, {
      name: data.name.trim()
    });

    if (update) {
      return { status: 200, data: 'Automation successfully updated' }
    }

    console.error('Failed to update automation:', { automationId, data })
    return { status: 404, data: 'Oops! could not find automation' }
  } catch (error) {
    console.error('Error updating automation:', error instanceof Error ? error.message : 'Unknown error', { automationId, data })
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveListener = async (
  autmationId: string,
  listener: 'OMNIAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const create = await addListener(autmationId, listener, prompt, reply)
    if (create) return { status: 200, data: 'Listener created' }
    return { status: 404, data: 'Cant save listener' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveTrigger = async (automationId: string, trigger: string[], config?: any) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const create = await addTrigger(automationId, trigger, config)
    if (create) return { status: 200, data: 'Trigger saved' }
    console.error('Failed to save trigger:', { automationId, trigger, config })
    return { status: 404, data: 'Cannot save trigger' }
  } catch (error) {
    console.error('Error saving trigger:', error instanceof Error ? error.message : 'Unknown error', { automationId, trigger, config })
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const removeTrigger = async (automationId: string) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const result = await deleteTrigger(automationId)
    if (result) return { status: 200, data: 'Trigger removed' }
    return { status: 404, data: 'Cannot remove trigger' }
  } catch (error) {
    console.error('Error removing trigger:', error)
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const saveKeyword = async (automationId: string, keyword: string) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const create = await addKeyWord(automationId, keyword)

    if (create) return { status: 200, data: 'Keyword added successfully' }

    return { status: 404, data: 'Cannot add this keyword' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const deleteKeyword = async (id: string) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const deleted = await deleteKeywordQuery(id)
    if (deleted)
      return {
        status: 200,
        data: 'Keyword deleted',
      }
    return { status: 404, data: 'Keyword not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const getProfilePosts = async () => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401 }
  }

  try {
    const profile = await findUser(user.data.id)
    const posts = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,thumbnail_url,media_type,timestamp&limit=10&access_token=${profile?.integrations[0].token}`
    )
    const parsed = await posts.json()
    if (parsed) {
      // Transform the response to use thumbnail_url for videos
      const transformedData = {
        ...parsed,
        data: parsed.data.map((post: any) => ({
          ...post,
          media_url: post.media_type === 'VIDEO' && post.thumbnail_url ? post.thumbnail_url : post.media_url
        }))
      }
      return { status: 200, data: transformedData }
    }
    console.log('🔴 Error in getting posts')
    return { status: 404 }
  } catch (error) {
    console.log('🔴 server side Error in getting posts ', error)
    return { status: 500 }
  }
}

export const savePosts = async (
  autmationId: string,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }[]
) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const create = await addPost(autmationId, posts)

    if (create) return { status: 200, data: 'Posts attached' }

    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const activateAutomation = async (id: string, state: boolean) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const update = await updateAutomation(id, { active: state })
    if (update)
      return {
        status: 200,
        data: `Automation is now ${state ? 'Live' : 'Draft'}`,
      }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const deleteAutomation = async (id: string) => {
  const user = await onCurrentUser()
  if (user.status !== 200 || !user.data) {
    return { status: 401, data: 'Unauthorized' }
  }

  try {
    const deleted = await deleteAutomationQuery(id)
    if (deleted) {
      return {
        status: 200,
        data: 'Automation deleted successfully'
      }
    }
    return { status: 404, data: 'Automation not found' }
  } catch (error) {
    console.error('Error deleting automation:', error)
    return { status: 500, data: 'Failed to delete automation' }
  }
}