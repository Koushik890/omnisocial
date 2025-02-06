'use client'

import React, { useEffect, useState } from 'react'
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
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from './text-config-modal.module.css'

interface TextConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (text: string) => void
  initialText?: string
}

export function TextConfigModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialText = ''
}: TextConfigModalProps) {
  const [text, setText] = useState(initialText)

  useEffect(() => {
    setText(initialText)
  }, [initialText])

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleSave = () => {
    onSave(text)
    onClose()
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
          "p-6 pb-3 bg-gradient-to-b from-white/40 via-white/20 to-transparent dark:from-gray-800/40 dark:via-gray-800/20 dark:to-transparent",
        )}>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-semibold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Configure Message
              </DialogTitle>
              <DialogDescription className="text-[14px] text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                Enter the message you want to send to the user
              </DialogDescription>
            </div>
            <DialogClose 
              className="relative -mr-2 p-2 hover:bg-gray-900/5 dark:hover:bg-white/5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className={styles.dialogBody}>
          <textarea
            className={styles.textArea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            aria-label="Message text"
          />
          <div className={styles.footer}>
            <button
              className={styles.cancelButton}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              type="button"
            >
              Save Message
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 