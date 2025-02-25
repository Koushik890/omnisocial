import { CommentTriggerConfig } from './comment-trigger'
import { MessageTriggerConfig } from './message-trigger'

export const getTriggerConfigComponent = (triggerId: string) => {
  // Map UI trigger types to API trigger types
  const mappedId = triggerId === 'COMMENT' ? 'post-comments' :
                   triggerId === 'DM' ? 'user-message' :
                   triggerId

  switch (mappedId) {
    case 'post-comments':
      return CommentTriggerConfig
    case 'user-message':
      return MessageTriggerConfig
    default:
      return null
  }
} 