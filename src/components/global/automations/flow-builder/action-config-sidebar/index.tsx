'use client'

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { X, Type, Image, Video, Clock, PlayCircle, LayoutGrid, FileImage, CreditCard, Zap, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { TextConfigModal } from '../text-config-modal'
import styles from './action-config-sidebar.module.css'

interface ActionConfigSidebarProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (actionType: string, config?: any) => void
  initialMessage?: string
  onMessageDelete?: () => void
}

const ACTION_OPTIONS = [
  {
    id: 'text',
    name: 'Text',
    description: 'Send a text message to the user',
    icon: Type,
    isDisabled: false,
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Send an audio message',
    icon: PlayCircle,
    isDisabled: true,
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Share a video message',
    icon: Video,
    isDisabled: true,
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Send an interactive card',
    icon: CreditCard,
    isDisabled: true,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Share multiple images',
    icon: LayoutGrid,
    isDisabled: true,
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Dynamic content based on user',
    icon: FileImage,
    isDisabled: true,
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Send a single image',
    icon: Image,
    isDisabled: true,
  },
  {
    id: 'delay',
    name: 'Delay',
    description: 'Add a delay before next action',
    icon: Clock,
    isDisabled: true,
  },
]

const MotionSheetContent = motion.create(SheetContent)

export const ActionConfigSidebar: React.FC<ActionConfigSidebarProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialMessage,
  onMessageDelete
}) => {
  const [isTextModalOpen, setIsTextModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState<string | null>(initialMessage || null)

  useEffect(() => {
    if (initialMessage) {
      setSelectedText(initialMessage)
    }
  }, [initialMessage])

  const handleOptionClick = (option: typeof ACTION_OPTIONS[0]) => {
    if (option.isDisabled || selectedText) return // Disable click if there's already a selected message

    if (option.id === 'text') {
      setIsTextModalOpen(true)
    } else {
      onSelect(option.id)
    }
  }

  const handleTextSave = (text: string) => {
    setSelectedText(text)
    onSelect('text', { message: text })
    setIsTextModalOpen(false)
  }

  const handleMessageDelete = () => {
    setSelectedText(null)
    onSelect('text', { message: null, status: 'UNCONFIGURED' })
    onMessageDelete?.()
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
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="Close sidebar"
          >
            <X className={styles.closeIcon} />
            <span className="sr-only">Close</span>
          </button>
          <SheetHeader className={styles.header}>
            <SheetTitle className={styles.title}>Configure Message</SheetTitle>
            <p className={styles.subtitle}>Choose how you want to respond to the user</p>
          </SheetHeader>

          <motion.div 
            className={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {selectedText && (
              <motion.div 
                className={styles.selectedAction}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className={styles.selectedActionHeader}>
                  <MessageCircle className={styles.selectedActionIcon} />
                  <h4 className={styles.selectedActionTitle}>Selected Message</h4>
                  <button 
                    onClick={handleMessageDelete}
                    className={styles.deleteButton}
                    aria-label="Delete message"
                  >
                    <X className={styles.deleteIcon} />
                  </button>
                </div>
                <div className={styles.selectedActionContent}>
                  <p className={styles.selectedActionText}>{selectedText}</p>
                  <button 
                    onClick={() => setIsTextModalOpen(true)}
                    className={styles.editButton}
                    aria-label="Edit message"
                  >
                    Edit
                  </button>
                </div>
              </motion.div>
            )}

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <Zap className={styles.sectionIcon} />
                ACTIONS
              </h4>
              <div className={styles.options}>
                {ACTION_OPTIONS.map((option, index) => (
                  <motion.button
                    key={option.id}
                    className={`${styles.option} ${option.isDisabled || selectedText ? styles.disabled : ''}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={Boolean(option.isDisabled || selectedText)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={!option.isDisabled && !selectedText ? { y: -2, transition: { duration: 0.2 } } : {}}
                    whileTap={!option.isDisabled && !selectedText ? { y: -1 } : {}}
                    role="button"
                    aria-disabled={Boolean(option.isDisabled || selectedText)}
                  >
                    <div className={styles.optionContent}>
                      <div className={styles.optionInfo}>
                        <option.icon className={styles.optionIcon} />
                        <div className={styles.optionTextContent}>
                          <span className={styles.optionName}>{option.name}</span>
                          <span className={styles.optionDescription}>{option.description}</span>
                        </div>
                      </div>
                      {(option.isDisabled || selectedText) && (
                        <span className={styles.comingSoon} aria-label="Coming Soon">
                          {option.isDisabled ? 'Coming Soon' : 'Unavailable'}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </MotionSheetContent>
      </Sheet>

      <TextConfigModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        onSave={handleTextSave}
        initialText={selectedText || ''}
      />
    </>
  )
} 