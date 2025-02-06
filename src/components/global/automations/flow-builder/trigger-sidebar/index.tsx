'use client'

import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { InstagramIcon, X, Reply } from 'lucide-react'
import { CommentIcon } from '@/icons/comment-icon'
import { MessageIcon } from '@/icons/message-icon'
import { motion } from 'framer-motion'
import styles from './trigger-sidebar.module.css'
import { LucideIcon } from 'lucide-react'

export interface TriggerSidebarProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (triggerId: string, triggerName: string, icon: React.ComponentType<any>) => void
  selectedTriggers: Array<{ id: string; name: string; icon: React.ComponentType<any> }>
}

const TRIGGER_OPTIONS = [
  {
    id: 'post-comments',
    name: 'Post or Reel Comments',
    description: 'When someone comments on content',
    icon: CommentIcon,
    isDisabled: false,
  },
  {
    id: 'user-message',
    name: 'Instagram Message',
    description: 'When someone sends a DM',
    icon: MessageIcon,
    isDisabled: false,
  },
  {
    id: 'story-replies',
    name: 'Story Replies',
    description: 'When someone replies to story',
    icon: Reply,
    isDisabled: true,
  },
]

const MotionSheetContent = motion.create(SheetContent)

export const TriggerSidebar: React.FC<TriggerSidebarProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedTriggers,
}) => {
  // Create a memoized version of TRIGGER_OPTIONS with dynamic disabled state
  const dynamicTriggerOptions = React.useMemo(() => {
    return TRIGGER_OPTIONS.map(option => ({
      ...option,
      // Disable if the option is already disabled or if it's selected
      isDisabled: option.isDisabled || selectedTriggers.some(trigger => trigger.id === option.id)
    }))
  }, [selectedTriggers])

  return (
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
          onClick={onClose} 
          className={styles.closeButton}
          aria-label="Close sidebar"
        >
          <X className={styles.closeIcon} />
          <span className="sr-only">Close</span>
        </button>
        <SheetHeader className={styles.header}>
          <SheetTitle className={styles.title}>Select a trigger</SheetTitle>
          <p className={styles.subtitle}>Pick one or more events to start this automation</p>
        </SheetHeader>

        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <InstagramIcon className={styles.sectionIcon} />
              INSTAGRAM
            </h4>
            <div className={styles.options}>
              {dynamicTriggerOptions.map((option, index) => {
                const isSelected = selectedTriggers.some(trigger => trigger.id === option.id)
                return (
                  <motion.button
                    key={option.id}
                    className={`${styles.option} ${option.isDisabled ? styles.disabled : ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => !option.isDisabled && onSelect(option.id, option.name, option.icon)}
                    disabled={option.isDisabled}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={!option.isDisabled ? { y: -2, transition: { duration: 0.2 } } : {}}
                    whileTap={!option.isDisabled ? { y: -1 } : {}}
                    role="button"
                    aria-disabled={option.isDisabled}
                    aria-pressed={isSelected}
                  >
                    <div className={styles.optionContent}>
                      <div className={styles.optionInfo}>
                        <option.icon className={styles.optionIcon} />
                        <div className={styles.optionTextContent}>
                          <span className={styles.optionName}>{option.name}</span>
                          <span className={styles.optionDescription}>{option.description}</span>
                        </div>
                      </div>
                      {option.isDisabled ? (
                        isSelected ? (
                          <span className={styles.selectedBadge} aria-label="Selected">
                            Selected
                          </span>
                        ) : (
                          <span className={styles.comingSoon} aria-label="Coming Soon">
                            Coming Soon
                          </span>
                        )
                      ) : isSelected && (
                        <span className={styles.selectedBadge} aria-label="Selected">
                          Selected
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </MotionSheetContent>
    </Sheet>
  )
} 