'use client'

import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Card } from '@/components/ui/card'
import { Zap, LucideIcon } from 'lucide-react'
import { AutomationKeyword } from '@/types/automation'
import { Button } from '@/components/ui/button'
import { TriggerSidebar } from '../trigger-sidebar'
import { FlowConfigSidebar } from '../flow-config-sidebar'
import { ActionModal } from '../action-modal'
import styles from './trigger-node.module.css'
import { motion } from 'framer-motion'
import { TriggerSidebarProps } from '../trigger-sidebar'

interface TriggerNodeProps {
  data: {
    type: string
    keywords: AutomationKeyword[]
    selectedActions?: Array<{ id: string; name: string; icon: React.ComponentType<any> }>
    selectedTriggers?: Array<{ id: string; name: string; icon: React.ComponentType<any> }>
    onTriggerSelect?: (triggerId: string, triggerName: string, icon: React.ComponentType<any>) => void
    onTriggerRemove?: (triggerId: string) => void
    onActionSelect?: (actionId: string, action: 'MESSAGE' | 'OMNIAI', actionName: string, icon: React.ComponentType<any>) => void
    onActionRemove?: (actionId: string) => void
    isConfigSidebarOpen?: boolean
    onConfigSidebarClose?: () => void
    onConfigSidebarOpen?: () => void
    isTriggerSidebarOpen?: boolean
    onTriggerSidebarOpen?: () => void
    onTriggerSidebarClose?: () => void
  }
}

export const TriggerNode: React.FC<TriggerNodeProps> = ({ data }) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)

  const handleNodeClick = (e: React.MouseEvent) => {
    // Check if the click was on the "+ New Trigger" button
    const isNewTriggerButton = (e.target as HTMLElement).closest(`.${styles.addTrigger}`)
    if (!isNewTriggerButton && data.onConfigSidebarOpen) {
      data.onConfigSidebarOpen()
    }
  }

  return (
    <>
      <Card 
        className={styles.triggerNode}
        onClick={handleNodeClick}
      >
        {/* Header with Icon and Title */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Zap className={styles.icon} />
          </div>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>When...</h3>
          </div>
        </div>

        {/* Description or Selected Triggers */}
        {data.selectedTriggers && data.selectedTriggers.length > 0 ? (
          <div className={styles.selectedTriggers}>
            {data.selectedTriggers.map((trigger) => (
              <motion.div
                key={trigger.id}
                className={styles.selectedTrigger}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.triggerIconWrapper}>
                  <trigger.icon className={styles.triggerIcon} />
                </div>
                <p className={styles.selectedTriggerText}>{trigger.name}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className={styles.description}>
            A Trigger is an event that starts your Automation.
            <br />
            Click to add a Trigger.
          </p>
        )}

        {/* Add Trigger Button */}
        <Button
          variant="ghost"
          className={styles.addTrigger}
          onClick={(e) => {
            e.stopPropagation()
            if (data.onTriggerSidebarOpen) {
              data.onTriggerSidebarOpen()
            }
          }}
        >
          <span className={styles.buttonContent}>+ New Trigger</span>
        </Button>

        {/* Then text with flow indicator */}
        <div className={styles.flowIndicator}>
          <span className={styles.thenText}>Then</span>
        </div>

        {/* Handle for connections */}
        <Handle
          type="source"
          position={Position.Right}
          className={styles.handle}
          isConnectable={false}
        />
      </Card>

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSelect={(actionId, action, actionName, icon) => {
          if (data.onActionSelect) {
            data.onActionSelect(actionId, action as 'MESSAGE' | 'OMNIAI', actionName, icon)
          }
          setIsActionModalOpen(false)
        }}
      />
    </>
  )
}