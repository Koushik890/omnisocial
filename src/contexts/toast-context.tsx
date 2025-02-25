'use client'

import * as React from 'react'
import { ToastNotification } from '@/components/ui/toast-notification'

interface ToastContextType {
  showToast: (type: 'loading' | 'success', message?: string) => void
  hideToast: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState(false)
  const [state, setState] = React.useState<'loading' | 'success'>('loading')
  const [message, setMessage] = React.useState<string>('')

  const showToast = React.useCallback((type: 'loading' | 'success', message?: string) => {
    setState(type)
    if (message) setMessage(message)
    setShow(true)
  }, [])

  const hideToast = React.useCallback(() => {
    setShow(false)
  }, [])

  const value = React.useMemo(
    () => ({
      showToast,
      hideToast
    }),
    [showToast, hideToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastNotification
        show={show}
        state={state}
        loadingText={state === 'loading' ? message || 'Saving changes' : undefined}
        successText={state === 'success' ? message || 'Changes saved' : undefined}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 