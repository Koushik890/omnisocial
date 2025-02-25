import { useCallback, useEffect } from 'react'
import { useToast } from '@/contexts/toast-context'

interface UseTriggerSelectionOptions {
  onSelect: (triggerId: string, triggerName: string, icon: React.ComponentType<any>) => void
  onError?: (error: Error) => void
}

export function useTriggerSelection({ onSelect, onError }: UseTriggerSelectionOptions) {
  const { showToast } = useToast()

  // Handle beforeunload event
  const preventReload = (e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.returnValue = 'Changes you made may not be saved. Are you sure you want to leave?'
    return e.returnValue
  }

  const handleTriggerSelect = useCallback(
    async (triggerId: string, triggerName: string, icon: React.ComponentType<any>) => {
      try {
        // Call onSelect immediately to update UI
        onSelect(triggerId, triggerName, icon)

        // Show loading toast and prevent page reload
        showToast('loading', 'Saving trigger')
        window.addEventListener('beforeunload', preventReload)

        // Simulate saving operation with a longer duration
        await new Promise((resolve) => setTimeout(resolve, 6000))

        // Show success toast and remove reload prevention
        window.removeEventListener('beforeunload', preventReload)
        showToast('success', 'Trigger saved')
      } catch (error) {
        // Remove reload prevention on error
        window.removeEventListener('beforeunload', preventReload)
        console.error('Error selecting trigger:', error)
        onError?.(error as Error)
        throw error
      }
    },
    [onSelect, showToast, onError]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', preventReload)
    }
  }, [])

  return { handleTriggerSelect }
}