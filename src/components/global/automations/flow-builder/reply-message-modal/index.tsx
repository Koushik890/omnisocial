'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogOverlay,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, Pencil, Sparkles, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import styles from './reply-message-modal.module.css'

interface ReplyMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (messages: string | string[]) => void
  initialMessage?: string
}

const DEFAULT_REPLIES = [
  {
    id: '1',
    message: 'Link delivered, check your DMs 📬',
  },
  {
    id: '2',
    message: 'Sent the secret, check messages 💭',
  },
  {
    id: '3',
    message: 'Info delivered! Review your inbox ⭐',
  },
]

export function ReplyMessageModal({
  isOpen,
  onClose,
  onSave,
  initialMessage = ''
}: ReplyMessageModalProps) {
  const [predefinedReplies, setPredefinedReplies] = useState(DEFAULT_REPLIES)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showNewReplyOptions, setShowNewReplyOptions] = useState(false)
  const [isManualInput, setIsManualInput] = useState(false)
  const [newReplyText, setNewReplyText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSection, setSelectedSection] = useState<'yes' | 'no' | null>(null)

  // Handle Escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleSelectYesSection = () => {
    const allMessages = predefinedReplies.map(reply => reply.message)
    setSelectedSection('yes')
    onSave(allMessages)
    onClose()
  }

  const handleSelectNoSection = () => {
    setSelectedSection('no')
    onSave('no')
    onClose()
  }

  const handleEdit = (id: string, message: string) => {
    setEditingId(id)
    setEditValue(message)
  }

  const handleSaveEdit = (id: string) => {
    setPredefinedReplies(prev => 
      prev.map(reply => 
        reply.id === id ? { ...reply, message: editValue } : reply
      )
    )
    setEditingId(null)
    setEditValue('')
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
    setEditValue('')
  }

  const handleNewReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowNewReplyOptions(true)
  }

  const handleManualInput = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsManualInput(true)
    setShowNewReplyOptions(false)
  }

  const handleGenerateWithAI = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Generate a short, engaging social media reply notifying the user that their requested details have been sent via direct message. Ensure the response is concise, friendly, and varied in phrasing while including a clear call to action and a relevant emoji. Avoid repetitive wording across different responses.',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate AI response')
      }

      const data = await response.json()
      const newReply = {
        id: `reply-${Date.now()}`,
        message: data.message
      }
      setPredefinedReplies(prev => [...prev, newReply])
      setShowNewReplyOptions(false)
    } catch (error) {
      console.error('Error generating AI response:', error)
      // You might want to show a toast notification here
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveManualInput = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (newReplyText.trim()) {
      const newReply = {
        id: `reply-${Date.now()}`,
        message: newReplyText.trim()
      }
      setPredefinedReplies(prev => [...prev, newReply])
      setNewReplyText('')
      setIsManualInput(false)
    }
  }

  // Reset states when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowNewReplyOptions(false)
      setIsManualInput(false)
      setNewReplyText('')
      setIsGenerating(false)
    }
  }, [isOpen])

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogOverlay className={styles.dialogOverlay} />
      <DialogContent 
        className={cn(
          styles.dialogContent,
          'sm:max-w-[520px] p-0 gap-0',
          'bg-white/80 dark:bg-gray-900/80',
          'backdrop-blur-3xl',
          'border border-white/20 dark:border-gray-800/30',
          'shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.4)]',
          'sm:!rounded-[28px]',
          '[&>button]:hidden overflow-hidden',
          '[&_.radix-dialog-content]:!rounded-[28px]',
          '[&_.radix-dialog-overlay]:!rounded-[28px]',
          '[&>div]:!rounded-[28px]',
          '[&>*>*]:!rounded-[28px]',
          'ring-1 ring-black/[0.03] dark:ring-white/[0.03]'
        )}
      >
        <DialogHeader className={cn(
          styles.dialogHeader,
          "bg-gradient-to-b from-white/40 via-white/20 to-transparent dark:from-gray-800/40 dark:via-gray-800/20 dark:to-transparent",
        )}>
          <div className="flex justify-between items-start w-full">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent pr-2">
                Would you like to set up Public Reply in the feed?
              </DialogTitle>
            </div>
            <DialogClose 
              className="relative flex-shrink-0 p-2 hover:bg-gray-900/5 dark:hover:bg-white/5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className={cn(
          styles.dialogBody,
          "space-y-2.5",
        )}>
          {/* Yes, random multiple replies */}
          <Card
            className={cn(
              'group relative flex flex-col gap-4 p-4',
              'cursor-pointer',
              'bg-white/40 dark:bg-gray-800/40',
              'hover:bg-white dark:hover:bg-gray-700/40',
              'border border-white/50 dark:border-gray-700/50',
              'rounded-[16px]',
              'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
              'hover:-translate-y-[2px]',
              'hover:border-purple-500/40 dark:hover:border-purple-500/30',
              'transition-all duration-300 ease-out',
              'motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-2',
              'motion-reduce:transition-none',
              selectedSection === 'yes' && 'ring-2 ring-purple-500'
            )}
            onClick={handleSelectYesSection}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectYesSection()}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Yes, random multiple replies
              </h3>
            </div>
            
            <div className={styles.replyGrid}>
              {predefinedReplies.map((reply) => (
                <motion.div
                  key={reply.id}
                  className={styles.replyItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingId === reply.id ? (
                    <div className={styles.editContainer}>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editActions}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSaveEdit(reply.id)
                          }}
                          className={styles.editButton}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleCancelEdit(e)}
                          className={styles.editButton}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.replyContent}>
                      <p className={styles.replyText}>
                        {reply.message}
                      </p>
                      <div className={styles.replyActions}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(reply.id, reply.message)
                          }}
                          className={styles.actionIcon}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPredefinedReplies(prev => prev.filter(r => r.id !== reply.id))
                          }}
                          className={cn(styles.actionIcon, styles.removeIcon)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {isManualInput ? (
                <>
                  <motion.div
                    className={styles.replyItem}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.editContainer}>
                      <Input
                        value={newReplyText}
                        onChange={(e) => setNewReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editActions}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleSaveManualInput}
                          className={styles.editButton}
                          disabled={!newReplyText.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsManualInput(false)
                            setShowNewReplyOptions(false)
                          }}
                          className={styles.editButton}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className={cn(styles.replyItem, styles.newReply)}
                    onClick={handleNewReplyClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className={styles.replyText}>+ New Reply</p>
                  </motion.div>
                </>
              ) : showNewReplyOptions ? (
                <>
                  <motion.div
                    className={styles.newReplyOptions}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button
                      onClick={handleGenerateWithAI}
                      className={cn(
                        styles.optionButton,
                        'flex items-center gap-2',
                        isGenerating && 'opacity-70 cursor-not-allowed'
                      )}
                      disabled={isGenerating}
                    >
                      <Sparkles className="h-4 w-4" />
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </Button>
                    <Button
                      onClick={handleManualInput}
                      className={cn(styles.optionButton, 'flex items-center gap-2')}
                    >
                      <Type className="h-4 w-4" />
                      Type manually
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className={cn(styles.replyItem, styles.newReply)}
                  onClick={handleNewReplyClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className={styles.replyText}>+ New Reply</p>
                </motion.div>
              )}
            </div>
          </Card>

          {/* No Option */}
          <Card
            className={cn(
              'group relative flex flex-row items-center gap-4 py-3.5 px-4',
              'cursor-pointer',
              'bg-white/40 dark:bg-gray-800/40',
              'hover:bg-white dark:hover:bg-gray-700/40',
              'border border-white/50 dark:border-gray-700/50',
              'rounded-[16px]',
              'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
              'hover:-translate-y-[2px]',
              'hover:border-purple-500/40 dark:hover:border-purple-500/30',
              'transition-all duration-300 ease-out',
              'motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-2',
              'motion-reduce:transition-none',
              'motion-safe:delay-[50ms]',
              selectedSection === 'no' && 'ring-2 ring-purple-500'
            )}
            onClick={handleSelectNoSection}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectNoSection()}
          >
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                No
              </h3>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 