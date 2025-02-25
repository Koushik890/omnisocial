'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ToastNotificationProps extends Omit<HTMLMotionProps<"div">, "children"> {
  state: 'loading' | 'success'
  loadingText?: string
  successText?: string
  show: boolean
  onHide?: () => void
}

const springConfig = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
  mass: 1,
}

export function ToastNotification({
  state = 'loading',
  loadingText = 'Saving changes',
  successText = 'Changes saved',
  show,
  onHide,
  className,
  ...props
}: ToastNotificationProps) {
  React.useEffect(() => {
    if (state === 'success' && show) {
      const timer = setTimeout(() => {
        onHide?.()
      }, 2000) // Hide after 2 seconds of showing success
      return () => clearTimeout(timer)
    }
  }, [state, show, onHide])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            'fixed left-1/2 top-24 z-50 -translate-x-1/2',
            'inline-flex h-10 items-center justify-center overflow-hidden rounded-full',
            'bg-white dark:bg-gray-800',
            'border border-black/[0.08] dark:border-white/[0.08]',
            'shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_16px_-4px_rgba(0,0,0,0.1)]',
            'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_16px_-4px_rgba(0,0,0,0.2)]',
            className,
          )}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={springConfig}
          {...props}
        >
          <div className="flex h-full items-center justify-between px-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {state === 'loading' && (
                  <>
                    <Spinner size="sm" color="slate" />
                    <div className="text-[13px] font-medium leading-tight whitespace-nowrap">
                      {loadingText}
                    </div>
                  </>
                )}
                {state === 'success' && (
                  <>
                    <div className="p-0.5 bg-emerald-500/10 dark:bg-emerald-500/25 rounded-[99px] shadow-sm border border-emerald-500/20 dark:border-emerald-500/25 justify-center items-center gap-1.5 flex overflow-hidden">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div className="text-[13px] font-normal leading-tight whitespace-nowrap">
                      {successText}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 