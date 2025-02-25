import { InstagramPostProps } from '@/types/posts.type'

export interface BaseTriggerConfigProps {
  isOpen: boolean
  onClose: () => void
  automationId: string
  onTriggerConfig: (type: string, config: any) => void
}

export interface TriggerConfig {
  type?: 'specific' | 'all' | 'next'
  postId?: string
  mediaUrl?: string
  keywords?: {
    include: string[]
  }
  replyMessages?: string[]
  status?: 'complete' | 'partial' | 'unconfigured'
  posts?: {
    postId: string
    mediaType: string
    mediaUrl: string
    caption: string | null
  }[]
}

export interface KeywordState {
  include: string[]
}

export const updateConfigurationStatus = (config: Partial<TriggerConfig>, triggerType?: string) => {
  // Special handling for message trigger
  if (triggerType === 'user-message') {
    // For message trigger, only keywords are required
    const hasKeywords = config.keywords?.include && config.keywords.include.length > 0
    return hasKeywords ? 'complete' : 'unconfigured'
  }

  // For other triggers (e.g., post-comments)
  // Check for post selection
  const hasPost = config.type === 'specific' && !!config.postId && !!config.mediaUrl

  // Check for keywords
  const hasKeywords = config.keywords?.include && config.keywords.include.length > 0

  // Check for reply messages
  const hasReplyMessages = config.replyMessages && config.replyMessages.length > 0

  // Return complete only if ALL configurations are present
  if (hasPost && hasKeywords && hasReplyMessages) {
    return 'complete'
  }

  // Return partial if ANY configuration is present
  if (hasPost || hasKeywords || hasReplyMessages) {
    return 'partial'
  }

  // Return unconfigured if NO configuration is present
  return 'unconfigured'
} 