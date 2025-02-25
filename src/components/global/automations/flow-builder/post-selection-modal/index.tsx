'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import styles from './post-selection-modal.module.css'
import { useQueryAutomationPosts } from '@/hooks/user-queries'
import { InstagramPostProps } from '@/types/posts.type'
import { BlurImage } from '@/components/ui/blur-image'
import Loader from '@/components/global/loader'

interface PostSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (selection: {
    type: 'specific' | 'all' | 'next'
    postId?: string
  }, post?: InstagramPostProps) => void
  selectedPostId?: string
}

export function PostSelectionModal({ isOpen, onClose, onSelect, selectedPostId }: PostSelectionModalProps) {
  const { data: postsData, isLoading, error } = useQueryAutomationPosts()
  const [selectedId, setSelectedId] = React.useState<string | null>(selectedPostId || null)

  // Handle Escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Reset selection when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedId(null)
    }
  }, [isOpen])

  // Update selected ID when selectedPostId prop changes
  React.useEffect(() => {
    setSelectedId(selectedPostId || null)
  }, [selectedPostId])

  const handlePostSelect = (postId: string) => {
    setSelectedId(postId)
  }

  const handleConfirmSelection = () => {
    if (selectedId) {
      const selectedPost = postsData?.status === 200 
        ? postsData.data.data.find((post: InstagramPostProps) => post.id === selectedId)
        : undefined
      onSelect({ type: 'specific', postId: selectedId }, selectedPost)
      onClose()
    }
  }

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
          'bg-white/80',
          'backdrop-blur-3xl',
          'border border-white/20',
          'shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)]',
          'sm:!rounded-[28px]',
          '[&>button]:hidden overflow-hidden',
          '[&_.radix-dialog-content]:!rounded-[28px]',
          '[&_.radix-dialog-overlay]:!rounded-[28px]',
          '[&>div]:!rounded-[28px]',
          '[&>*>*]:!rounded-[28px]',
          'ring-1 ring-black/[0.03]'
        )}
      >
        <DialogHeader className={cn(
          styles.dialogHeader,
          "p-6 pb-3 bg-gradient-to-b from-white/40 via-white/20 to-transparent",
        )}>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-semibold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Which Post or Reel do you want to use?
              </DialogTitle>
              <DialogDescription className="text-[14px] text-gray-600 mt-1.5 leading-relaxed">
                Select the content you want to monitor for this automation
              </DialogDescription>
            </div>
            <DialogClose 
              className="relative -mr-2 p-2 hover:bg-gray-900/5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className={cn(
          styles.dialogBody,
          "px-6 pb-6 space-y-2.5",
        )}>
          {/* Specific Post Selection */}
          <Card
            className={cn(
              'group relative flex flex-col gap-4 p-4',
              'cursor-pointer',
              'bg-white/40',
              'hover:bg-white',
              'border border-white/50',
              'rounded-[16px]',
              'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
              'hover:-translate-y-[2px]',
              'hover:border-purple-500/40',
              'transition-all duration-300 ease-out',
              'motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-2',
              'motion-reduce:transition-none'
            )}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-[15px] font-semibold text-gray-900">
                Specific Post or Reel
              </h3>
              {postsData?.status === 200 && postsData.data.data.length > 6 && (
                <Button
                  variant="link"
                  className="text-[13px] text-purple-600 hover:text-purple-700 font-medium p-0 h-auto"
                  onClick={() => {}}
                >
                  See More
                </Button>
              )}
            </div>
            
            <div className={styles.postGrid}>
              {isLoading ? (
                <div className="col-span-3 py-8 flex justify-center items-center">
                  <Loader state>Loading posts...</Loader>
                </div>
              ) : error ? (
                <div className="col-span-3 py-8 text-center text-gray-500">
                  Failed to load posts. Please try again.
                </div>
              ) : postsData?.status === 200 && postsData.data.data.length > 0 ? (
                postsData.data.data.slice(0, 6).map((post: InstagramPostProps) => (
                  <motion.div
                    key={post.id}
                    className={cn(
                      styles.postItem,
                      selectedId === post.id && styles.selectedPost
                    )}
                    onClick={() => handlePostSelect(post.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BlurImage
                      src={post.media_url}
                      alt={post.caption || 'Instagram post'}
                      width={200}
                      height={200}
                      className={cn(
                        styles.postImage,
                        'object-cover w-full h-full'
                      )}
                    />
                    {post.media_type === 'VIDEO' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    )}
                    {selectedId === post.id && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-gray-500">
                  No posts found. Create some posts on Instagram first.
                </div>
              )}
            </div>

            {selectedId && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleConfirmSelection}
                  className={cn(
                    'bg-gradient-to-r from-purple-500 to-purple-600',
                    'text-white font-medium',
                    'hover:from-purple-600 hover:to-purple-700',
                    'active:from-purple-700 active:to-purple-800',
                    'transition-all duration-200',
                    'px-6 py-2 rounded-full',
                    'shadow-lg shadow-purple-500/25'
                  )}
                >
                  Confirm Selection
                </Button>
              </div>
            )}
          </Card>

          {/* All Posts Option */}
          <Card
            className={cn(
              'group relative flex flex-row items-center gap-4 py-3.5 px-4',
              'cursor-not-allowed opacity-75',
              'bg-white/40',
              'border border-white/50',
              'rounded-[16px]',
              'transition-all duration-300 ease-out',
              'motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-2',
              'motion-reduce:transition-none'
            )}
          >
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 transition-colors duration-200">
                All Posts or Reels
              </h3>
              <p className="text-[13px] text-gray-600 transition-colors duration-200 mt-0.5">
                Monitor all your content automatically
              </p>
            </div>
            <div className={styles.comingSoonBadge}>Coming Soon</div>
          </Card>

          {/* Next Post Option */}
          <Card
            className={cn(
              'group relative flex flex-row items-center gap-4 py-3.5 px-4',
              'cursor-not-allowed opacity-75',
              'bg-white/40',
              'border border-white/50',
              'rounded-[16px]',
              'transition-all duration-300 ease-out',
              'motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-2',
              'motion-reduce:transition-none',
              'motion-safe:delay-[50ms]'
            )}
          >
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900 transition-colors duration-200">
                Next Post or Reel
              </h3>
              <p className="text-[13px] text-gray-600 transition-colors duration-200 mt-0.5">
                Automatically apply to your next upload
              </p>
            </div>
            <div className={styles.comingSoonBadge}>Coming Soon</div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 