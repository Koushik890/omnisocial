'use client'

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { X, Instagram, Hash, MessageSquare, ChevronRight, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import styles from './trigger-configuration-sidebar.module.css'
import { PostSelectionModal } from '../post-selection-modal'
import { KeywordConfigurationModal } from '../keyword-configuration-modal'
import { ReplyMessageModal } from '../reply-message-modal'
import { BlurImage } from '@/components/ui/blur-image'
import { InstagramPostProps } from '@/types/posts.type'
import { useAutomationSync } from '@/hooks/use-automations'
import { useQueryAutomation } from '@/hooks/user-queries'
import { TriggerConfig, TriggerConfigurationStatus } from '@/types/automation'

interface TriggerConfigurationSidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedTrigger: {
    id: string
    name: string
    icon: React.ComponentType<any>
  } | null
  automationId: string
  onTriggerConfig?: (type: string, config: any) => void
}

interface TriggerData {
  id: string;
  type: string;
  config?: any;
  automationId: string | null;
}

interface KeywordState {
  include: string[]
}

const MotionSheetContent = motion.create(SheetContent)

const updateConfigurationStatus = (config: Partial<TriggerConfig>): TriggerConfigurationStatus => {
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

export function TriggerConfigurationSidebar({
  isOpen,
  onClose,
  selectedTrigger,
  automationId,
  onTriggerConfig
}: TriggerConfigurationSidebarProps) {
  const [isPostSelectionModalOpen, setIsPostSelectionModalOpen] = useState(false)
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false)
  const [isReplyMessageModalOpen, setIsReplyMessageModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<InstagramPostProps | null>(null)
  const [keywords, setKeywords] = useState<KeywordState>({
    include: []
  })
  const [replyMessage, setReplyMessage] = useState('')
  const { saveChanges } = useAutomationSync(automationId)
  const { data: automationData } = useQueryAutomation(automationId)

  // Reset all configuration states when selectedTrigger changes or is removed
  useEffect(() => {
    if (!selectedTrigger) {
      // Reset all states when trigger is removed
      setSelectedPost(null)
      setKeywords({ include: [] })
      setReplyMessage('')
      return
    }

    // When a new trigger is selected, initialize states from automation data
    if (automationData?.data) {
      const trigger = automationData.data.trigger?.find((t) => t.type === selectedTrigger.id)
      
      if (trigger?.config) {
        try {
          const config = typeof trigger.config === 'string' 
            ? JSON.parse(trigger.config) 
            : trigger.config
          
          // Only set states if the config belongs to the current trigger
          if (config.type === 'specific' && config.postId) {
            setSelectedPost({
              id: config.postId,
              media_url: config.mediaUrl,
              media_type: config.mediaType,
              caption: config.caption
            } as InstagramPostProps)
          }
          
          // Only update keywords if they're not already set
          if (!keywords.include.length) {
            setKeywords(config.keywords || { include: [] })
          }
          
          if (!replyMessage) {
            setReplyMessage(config.replyMessages ? config.replyMessages.join(' | ') : '')
          }
        } catch (error) {
          console.error('Error parsing trigger config:', error)
        }
      }
    }
  }, [selectedTrigger, automationData?.data, keywords.include.length, replyMessage])

  const handlePostSelection = (selection: { type: 'specific' | 'all' | 'next'; postId?: string }, post?: InstagramPostProps) => {
    if (selection.type === 'specific' && post) {
      // Update local state first
      setSelectedPost(post)
      setIsPostSelectionModalOpen(false)

      // Then update the configuration
      const config: Partial<TriggerConfig> = {
        type: selection.type,
        postId: post.id,
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        caption: post.caption,
        keywords: keywords,
        replyMessages: replyMessage ? replyMessage.split(' | ') : undefined,
        status: updateConfigurationStatus({
          type: selection.type,
          postId: post.id,
          mediaType: post.media_type,
          mediaUrl: post.media_url,
          caption: post.caption,
          keywords: keywords,
          replyMessages: replyMessage ? replyMessage.split(' | ') : undefined
        })
      }

      if (onTriggerConfig && selectedTrigger) {
        // Wrap in Promise.resolve to ensure state updates complete before saving
        Promise.resolve().then(() => {
          onTriggerConfig(selectedTrigger.id, config)
        })
      }
    } else if (selection.type === 'all' || selection.type === 'next') {
      // Update local state first
      setSelectedPost(null)
      setIsPostSelectionModalOpen(false)

      // Then update the configuration
      const config = { 
        type: selection.type,
        keywords: keywords,
        replyMessages: replyMessage ? replyMessage.split(' | ') : undefined,
        status: updateConfigurationStatus({
          type: selection.type,
          keywords: keywords,
          replyMessages: replyMessage ? replyMessage.split(' | ') : undefined
        })
      }

      if (onTriggerConfig && selectedTrigger) {
        // Wrap in Promise.resolve to ensure state updates complete before saving
        Promise.resolve().then(() => {
          onTriggerConfig(selectedTrigger.id, config)
        })
      }
    }
  }

  const handleRemoveSelectedPost = () => {
    setSelectedPost(null)
    if (onTriggerConfig && selectedTrigger) {
      onTriggerConfig(selectedTrigger.id, null)
    }
  }

  const handleKeywordConfiguration = () => {
    setIsKeywordModalOpen(true)
  }

  const handleKeywordSave = async (newKeywords: { include: string[] }) => {
    // Update local state first
    setKeywords(newKeywords)
    setIsKeywordModalOpen(false)

    // Then update the configuration
    if (onTriggerConfig && selectedTrigger) {
      const config = {
        type: selectedPost ? 'specific' : undefined,
        postId: selectedPost?.id,
        mediaType: selectedPost?.media_type,
        mediaUrl: selectedPost?.media_url,
        caption: selectedPost?.caption,
        keywords: newKeywords,
        replyMessages: replyMessage ? replyMessage.split(' | ') : undefined,
        status: updateConfigurationStatus({
          type: selectedPost ? 'specific' : undefined,
          postId: selectedPost?.id,
          mediaType: selectedPost?.media_type,
          mediaUrl: selectedPost?.media_url,
          caption: selectedPost?.caption,
          keywords: newKeywords,
          replyMessages: replyMessage ? replyMessage.split(' | ') : undefined
        })
      }

      try {
        // Use async/await to ensure state updates complete
        await Promise.resolve()
        onTriggerConfig(selectedTrigger.id, config)
      } catch (error) {
        console.error('Error saving keywords:', error)
      }
    }
  }

  const handleReplyConfiguration = () => {
    setIsReplyMessageModalOpen(true)
  }

  const handleReplyMessageSave = (messages: string | string[]) => {
    const messageArray = Array.isArray(messages) ? messages : [messages]
    setReplyMessage(messageArray.join(' | '))
    
    if (onTriggerConfig && selectedTrigger) {
      const config = {
        type: selectedPost ? 'specific' : undefined,
        postId: selectedPost?.id,
        mediaType: selectedPost?.media_type,
        mediaUrl: selectedPost?.media_url,
        caption: selectedPost?.caption,
        keywords: keywords,
        replyMessages: messageArray,
        status: updateConfigurationStatus({
          type: selectedPost ? 'specific' : undefined,
          postId: selectedPost?.id,
          mediaType: selectedPost?.media_type,
          mediaUrl: selectedPost?.media_url,
          caption: selectedPost?.caption,
          keywords: keywords,
          replyMessages: messageArray
        })
      }
      onTriggerConfig(selectedTrigger.id, config)
    }
  }

  const handleKeywordRemove = (keywordToRemove: string) => {
    const updatedKeywords = {
      include: keywords.include.filter(keyword => keyword !== keywordToRemove)
    }
    setKeywords(updatedKeywords)
    
    if (onTriggerConfig && selectedTrigger) {
      const config = {
        type: selectedPost ? 'specific' : undefined,
        postId: selectedPost?.id,
        mediaType: selectedPost?.media_type,
        mediaUrl: selectedPost?.media_url,
        caption: selectedPost?.caption,
        keywords: updatedKeywords,
        replyMessages: replyMessage ? replyMessage.split(' | ') : undefined,
        status: updateConfigurationStatus({
          type: selectedPost ? 'specific' : undefined,
          postId: selectedPost?.id,
          mediaType: selectedPost?.media_type,
          mediaUrl: selectedPost?.media_url,
          caption: selectedPost?.caption,
          keywords: updatedKeywords,
          replyMessages: replyMessage ? replyMessage.split(' | ') : undefined
        })
      }
      onTriggerConfig(selectedTrigger.id, config)
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <MotionSheetContent 
          side="right" 
          className={styles.sidebar}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <button 
            type="button"
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="Close sidebar"
          >
            <X className={styles.closeIcon} />
            <span className="sr-only">Close</span>
          </button>
          <SheetHeader className={styles.header}>
            <div className="pr-8">
              <SheetTitle className={styles.title}>Configure {selectedTrigger?.name}</SheetTitle>
              <p className={styles.subtitle}>Set up your automation trigger settings</p>
            </div>
          </SheetHeader>

          <motion.div 
            className={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Post/Reel Selection Section */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <Instagram className={styles.sectionIcon} />
                WHICH POST OR REEL?
              </h4>
              <div className={styles.sectionContent}>
                {selectedPost ? (
                  <div className={styles.selectedPostPreview}>
                    <div className={styles.selectedPostImage}>
                      <BlurImage
                        src={selectedPost.media_url}
                        alt={selectedPost.caption || 'Selected Instagram post'}
                        width={120}
                        height={120}
                        className={styles.previewImage}
                      />
                      {selectedPost.media_type === 'VIDEO' && (
                        <div className={styles.videoIndicator}>
                          <div className={styles.playIcon} />
                        </div>
                      )}
                    </div>
                    <div className={styles.selectedPostInfo}>
                      <p className={styles.postType}>
                        {selectedPost.media_type === 'VIDEO' ? 'Reel' : 'Post'}
                      </p>
                      {selectedPost.caption && (
                        <p className={styles.postCaption}>
                          {selectedPost.caption.length > 50 
                            ? `${selectedPost.caption.slice(0, 50)}...` 
                            : selectedPost.caption}
                        </p>
                      )}
                      <div className={styles.postActions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.changeButton}
                          onClick={() => setIsPostSelectionModalOpen(true)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Change
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.removeButton}
                          onClick={handleRemoveSelectedPost}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className={styles.configButton}
                    onClick={() => setIsPostSelectionModalOpen(true)}
                  >
                    <span className={styles.buttonText}>Select Post or Reel</span>
                    <ChevronRight className={styles.buttonIcon} />
                  </Button>
                )}
                <p className={styles.helperText}>
                  Choose the post or reel you want to monitor
                </p>
              </div>
            </div>

            {/* Keywords Section */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <Hash className={styles.sectionIcon} />
                KEYWORDS
              </h4>
              <div className={styles.sectionContent}>
                <Button
                  variant="outline"
                  className={styles.configButton}
                  onClick={handleKeywordConfiguration}
                >
                  <span className={styles.buttonText}>Configure Keywords</span>
                  <ChevronRight className={styles.buttonIcon} />
                </Button>
                <p className={styles.helperText}>
                  Set up keywords that will trigger this automation
                </p>
                {(keywords.include.length > 0) && (
                  <div className={styles.keywordsSummary}>
                    <div className={styles.keywordGroup}>
                      <span className={styles.keywordLabel}>Keywords:</span>
                      <div className={styles.keywordTags}>
                        {keywords.include.map(keyword => (
                          <div 
                            key={keyword} 
                            className={`${styles.keywordTag} group relative`}
                          >
                            {keyword}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleKeywordRemove(keyword)
                              }}
                              className="absolute right-0 top-0 bottom-0 px-1.5 hidden group-hover:flex items-center justify-center hover:bg-gray-100 rounded-r-md transition-colors"
                              aria-label={`Remove keyword ${keyword}`}
                            >
                              <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Configuration Section */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <MessageSquare className={styles.sectionIcon} />
                REPLY MESSAGE
              </h4>
              <div className={styles.sectionContent}>
                <Button
                  variant="outline"
                  className={styles.configButton}
                  onClick={handleReplyConfiguration}
                >
                  <span className={styles.buttonText}>Configure Reply Message</span>
                  <ChevronRight className={styles.buttonIcon} />
                </Button>
                <p className={styles.helperText}>
                  Set up the message you want to send in response
                </p>
                {replyMessage && (
                  <div className={styles.messageSummary}>
                    <p className={styles.messagePreview}>{replyMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </MotionSheetContent>
      </Sheet>

      <PostSelectionModal
        isOpen={isPostSelectionModalOpen}
        onClose={() => setIsPostSelectionModalOpen(false)}
        onSelect={handlePostSelection}
        selectedPostId={selectedPost?.id}
      />

      <KeywordConfigurationModal
        isOpen={isKeywordModalOpen}
        onClose={() => setIsKeywordModalOpen(false)}
        onSave={handleKeywordSave}
        initialKeywords={keywords}
        key={JSON.stringify(keywords)}
      />

      <ReplyMessageModal
        isOpen={isReplyMessageModalOpen}
        onClose={() => setIsReplyMessageModalOpen(false)}
        onSave={handleReplyMessageSave}
        initialMessage={replyMessage}
      />
    </>
  )
} 