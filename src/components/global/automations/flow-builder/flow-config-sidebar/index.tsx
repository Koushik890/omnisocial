'use client'

import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { X, Zap, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import styles from './flow-config-sidebar.module.css'

interface FlowConfigSidebarProps {
  isOpen: boolean
  onClose: () => void
  onChooseNextStep: () => void
  onNewTrigger: () => void
  selectedTriggers: Array<{ id: string; name: string; icon: React.ComponentType<any> }>
  onTriggerRemove: (triggerId: string) => void
  selectedActions: Array<{ id: string; name: string; icon: React.ComponentType<any> }>
  onActionRemove: (actionId: string) => void
  showChooseNextStep?: boolean
  onTriggerConfigurationOpen?: (trigger: { id: string; name: string; icon: React.ComponentType<any> }) => void
}

const MotionSheetContent = motion.create(SheetContent)

export const FlowConfigSidebar: React.FC<FlowConfigSidebarProps> = ({
  isOpen,
  onClose,
  onChooseNextStep,
  onNewTrigger,
  selectedTriggers,
  onTriggerRemove,
  selectedActions,
  onActionRemove,
  showChooseNextStep,
  onTriggerConfigurationOpen,
}) => {
  // Handle close with cleanup
  const handleClose = React.useCallback(() => {
    onClose()
  }, [onClose])

  const handleTriggerClick = (trigger: { id: string; name: string; icon: React.ComponentType<any> }) => {
    if (onTriggerConfigurationOpen) {
      onTriggerConfigurationOpen(trigger)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
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
          onClick={handleClose} 
          className={styles.closeButton}
          aria-label="Close sidebar"
        >
          <X className={styles.closeIcon} />
          <span className="sr-only">Close</span>
        </button>
        <SheetHeader className={styles.header}>
          <SheetTitle className={styles.title}>Configure Triggers</SheetTitle>
          <p className={styles.subtitle}>Set up your automation triggers and next steps</p>
        </SheetHeader>

        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* When Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <Zap className={styles.sectionIcon} />
              WHEN
            </h4>
            <div className={styles.selectedTriggers}>
              {selectedTriggers.map((trigger, index) => (
                <motion.div
                  key={trigger.id}
                  className={styles.selectedTriggerContainer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => handleTriggerClick(trigger)}
                >
                  <div className={styles.selectedTriggerContent}>
                    <div className={styles.triggerIconWrapper}>
                      <trigger.icon className={styles.triggerIcon} />
                    </div>
                    <div className={styles.triggerTextContent}>
                      <span className={styles.triggerTitle}>{trigger.name}</span>
                    </div>
                  </div>
                  <button 
                    className={styles.removeTriggerButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTriggerRemove(trigger.id)
                    }}
                    aria-label={`Remove ${trigger.name} trigger`}
                  >
                    <X className={styles.removeTriggerIcon} />
                  </button>
                </motion.div>
              ))}
            </div>
            {selectedTriggers.length === 0 && (
              <Button
                variant="ghost"
                className={styles.triggerButton}
                onClick={onNewTrigger}
              >
                <div className={styles.triggerButtonContent}>
                  + New Trigger
                </div>
              </Button>
            )}
          </div>

          {/* Then Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              THEN
            </h4>
            <div className={styles.selectedTriggers}>
              {selectedActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  className={styles.selectedTriggerContainer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className={styles.selectedTriggerContent}>
                    <div className={styles.triggerIconWrapper}>
                      <action.icon className={styles.triggerIcon} />
                    </div>
                    <div className={styles.triggerTextContent}>
                      <span className={styles.triggerTitle}>{action.name}</span>
                    </div>
                  </div>
                  <button 
                    className={styles.removeTriggerButton}
                    onClick={() => onActionRemove(action.id)}
                    aria-label={`Remove ${action.name} action`}
                  >
                    <X className={styles.removeTriggerIcon} />
                  </button>
                </motion.div>
              ))}
            </div>
            {showChooseNextStep && (
              <Button
                variant="ghost"
                className={styles.nextStepButton}
                onClick={onChooseNextStep}
              >
                <span className={styles.nextStepButtonContent}>
                  Choose Next Step
                </span>
              </Button>
            )}
          </div>
        </motion.div>
      </MotionSheetContent>
    </Sheet>
  )
} 