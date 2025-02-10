import React, { useState, KeyboardEvent, useEffect, useRef } from 'react'
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
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import styles from './keyword-configuration-modal.module.css'

interface KeywordConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (keywords: { include: string[] }) => void
  initialKeywords?: { include: string[] }
}

export function KeywordConfigurationModal({
  isOpen,
  onClose,
  onSave,
  initialKeywords = { include: [] }
}: KeywordConfigurationModalProps) {
  const [includeKeywords, setIncludeKeywords] = useState<string[]>(initialKeywords.include)
  const [includeInput, setIncludeInput] = useState('')
  const keywordsRef = useRef<string[]>([])

  // Update state when initialKeywords changes
  useEffect(() => {
    setIncludeKeywords(initialKeywords.include)
    keywordsRef.current = initialKeywords.include
  }, [initialKeywords])

  // Handle Escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape as any)
    return () => window.removeEventListener('keydown', handleEscape as any)
  }, [isOpen, onClose])

  const handleAddIncludeKeyword = () => {
    if (includeInput.trim() && !keywordsRef.current.includes(includeInput.trim())) {
      const newKeywords = [...keywordsRef.current, includeInput.trim()]
      setIncludeKeywords(newKeywords)
      keywordsRef.current = newKeywords
      setIncludeInput('')
    }
  }

  const handleRemoveIncludeKeyword = (keyword: string) => {
    const newKeywords = keywordsRef.current.filter(k => k !== keyword)
    setIncludeKeywords(newKeywords)
    keywordsRef.current = newKeywords
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddIncludeKeyword()
    }
  }

  const handleSave = () => {
    onSave({ include: keywordsRef.current })
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
          "p-6 pb-3 bg-gradient-to-b from-white/40 via-white/20 to-transparent dark:from-gray-800/40 dark:via-gray-800/20 dark:to-transparent",
        )}>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-semibold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                What will start your DM automation?
              </DialogTitle>
            </div>
            <DialogClose 
              className="relative -mr-2 p-2 hover:bg-gray-900/5 dark:hover:bg-white/5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className={cn(
          styles.dialogBody,
          "px-6 pb-6 space-y-6",
        )}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Specific Keywords</h3>
            
            {/* Include Keywords */}
            <div className={styles.keywordSection}>
              <p className={styles.keywordLabel}>Comments include these Keywords:</p>
              <div className={styles.inputWrapper}>
                <Input
                  type="text"
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="+ Keyword"
                  className={styles.keywordInput}
                />
              </div>
              <div className={styles.keywordsList}>
                {includeKeywords.map((keyword) => (
                  <motion.div
                    key={keyword}
                    className={styles.keywordTag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveIncludeKeyword(keyword)}
                      className={styles.removeKeyword}
                      aria-label={`Remove keyword ${keyword}`}
                    >
                      <X className={styles.removeKeywordIcon} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className={styles.helperText}>
            Keywords are not case-sensitive, e.g. "Hello" and "hello" are recognized as the same.
          </p>

          {/* Save Button */}
          <Button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={includeKeywords.length === 0}
          >
            Save Keywords
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}