'use client'

import React from 'react'
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Panel,
  addEdge,
  BackgroundVariant,
  OnConnectStartParams,
  XYPosition,
  NodeChange
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useQueryAutomation } from '@/hooks/user-queries'
import { TriggerNode } from './nodes/trigger-node'
import { ActionNode } from './nodes/action-node'
import { PlaceholderNode } from './nodes/placeholder-node'
import { AutomationData, TriggerConfig, TriggerConfigurationStatus } from '@/types/automation'
import { Button } from '@/components/ui/button'
import { MessageSquare, Bot, Instagram } from 'lucide-react'
import { toast } from 'sonner'
import { FlowConfigSidebar } from './flow-config-sidebar/index'
import { ActionModal } from './action-modal'
import { TriggerSidebar } from './trigger-sidebar'
import { getTriggerConfigComponent } from './trigger-configurations'
import { useAutomationWorkflow, useAutomationSync } from '@/hooks/use-automations'
import { useToast } from '@/contexts/toast-context'
import { useQueryClient } from '@tanstack/react-query'

interface FlowBuilderProps {
  id: string
}

interface TriggerDetails {
  name: string
  icon: React.ComponentType<any>
}

const TRIGGER_DETAILS: Record<string, TriggerDetails> = {
  'post-comments': {
    name: 'Post Comments',
    icon: MessageSquare
  },
  'COMMENT': {
    name: 'Post Comments',
    icon: MessageSquare
  },
  'user-message': {
    name: 'Instagram Message',
    icon: MessageSquare
  },
  'DM': {
    name: 'Instagram Message',
    icon: MessageSquare
  }
}

const getTriggerDetails = (type: string): TriggerDetails | undefined => {
  return TRIGGER_DETAILS[type]
}

// Pro options to remove watermark
const proOptions = { hideAttribution: true }

const getConfigurationStatus = (config?: TriggerConfig): TriggerConfigurationStatus => {
  if (!config) return 'unconfigured'
  if (config.status) return config.status

  // Determine status based on config content
  const hasPost = config.type === 'specific' && !!config.postId && !!config.mediaUrl
  const hasKeywords = (config.keywords?.include ?? []).length > 0
  const hasReplyMessages = (config.replyMessages ?? []).length > 0

  if (hasPost && hasKeywords && hasReplyMessages) return 'complete'
  if (hasPost || hasKeywords || hasReplyMessages) return 'partial'
  return 'unconfigured'
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ id }) => {
  const { data } = useQueryAutomation(id)
  const { showToast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = React.useState(false)
  const [isTriggerConfigOpen, setIsTriggerConfigOpen] = React.useState(false)
  const [isTriggerSidebarOpen, setIsTriggerSidebarOpen] = React.useState(false)
  const [isTriggerConfigurationOpen, setIsTriggerConfigurationOpen] = React.useState(false)
  const [selectedTriggerForConfig, setSelectedTriggerForConfig] = React.useState<{
    id: string
    name: string
    icon: React.ComponentType<any>
  } | null>(null)
  const [selectedActions, setSelectedActions] = React.useState<Array<{ id: string; name: string; icon: React.ComponentType<any> }>>([])
  const [selectedTriggers, setSelectedTriggers] = React.useState<Array<{ id: string; name: string; icon: React.ComponentType<any> }>>([])
  const actionNodeStateRef = React.useRef<{id: string; data: any} | null>(null)
  const isInitializedRef = React.useRef(false)
  const { saveChanges } = useAutomationSync(id)
  const [triggerConfig, setTriggerConfig] = React.useState<Record<string, TriggerConfig>>({})
  const queryClient = useQueryClient()

  // Handle trigger selection
  const handleTriggerSelect = React.useCallback((triggerId: string, triggerName: string, icon: React.ComponentType<any>) => {
    const newTrigger = { id: triggerId, name: triggerName, icon }
    
    // Clear previous trigger configuration
    setTriggerConfig({})
    
    // Set new trigger, replacing any existing ones
    setSelectedTriggers([newTrigger]) // Only allow one trigger at a time
    
    // Save the trigger selection with fresh configuration
    saveChanges({
      trigger: [{
        type: triggerId,
        config: {
          status: 'unconfigured',
          type: 'all',
          keywords: { include: [] },
          replyMessages: [],
          posts: []
        }
      }]
    })

    // Update nodes with fresh configuration
    setNodes(nds => nds.map(node => {
      if (node.type === 'trigger') {
        return {
          ...node,
          data: {
            ...node.data,
            selectedTriggers: [newTrigger],
            config: {
              status: 'unconfigured',
              type: 'all',
              keywords: { include: [] },
              replyMessages: [],
              posts: []
            },
            configurationStatus: 'unconfigured',
            type: triggerId
          }
        }
      }
      return node
    }))

    setIsTriggerSidebarOpen(false)
    setSelectedTriggerForConfig(newTrigger)
    setIsTriggerConfigurationOpen(true)
  }, [saveChanges, setNodes])

  // Handle trigger configuration
  const handleTriggerConfigurationOpen = React.useCallback((trigger: { id: string; name: string; icon: React.ComponentType<any> }) => {
    // Map UI trigger type to API trigger type for configuration
    const mappedTrigger = {
      ...trigger,
      id: trigger.id === 'COMMENT' ? 'post-comments' :
          trigger.id === 'DM' ? 'user-message' :
          trigger.id
    }
    setSelectedTriggerForConfig(mappedTrigger)
    setIsTriggerConfigurationOpen(true)
  }, [])

  // Handle trigger removal
  const handleTriggerRemove = React.useCallback(async (triggerId: string) => {
    try {
      // Show loading toast and prevent page reload
      showToast('loading', 'Removing trigger configuration')
      window.addEventListener('beforeunload', preventReload)
      
      // Clear all trigger-related states
      setSelectedTriggers([])
      setSelectedTriggerForConfig(null)
      setTriggerConfig({})
      setIsTriggerConfigurationOpen(false)

      // Update nodes to reset trigger node state
      setNodes(nds => nds.map(node => {
        if (node.type === 'trigger') {
          return {
            ...node,
            data: {
              ...node.data,
              selectedTriggers: [],
              config: undefined,
              configurationStatus: 'unconfigured',
              type: 'New Trigger'
            }
          }
        }
        return node
      }))

      // Save changes to remove the trigger from the database
      await saveChanges({
        trigger: [] // Empty array to trigger deletion
      })

      // Remove reload prevention and show success toast
      window.removeEventListener('beforeunload', preventReload)
      showToast('success', 'Trigger configuration removed')
    } catch (error) {
      // Remove reload prevention on error
      window.removeEventListener('beforeunload', preventReload)
      console.error('Error removing trigger:', error)
      toast.error('Failed to remove trigger')
    }
  }, [saveChanges, setNodes, showToast])

  // Add preventReload function
  const preventReload = React.useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.returnValue = 'Changes you made may not be saved. Are you sure you want to leave?'
    return e.returnValue
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', preventReload)
    }
  }, [preventReload])

  // Handle new trigger button click
  const handleNewTrigger = React.useCallback(() => {
    setIsTriggerConfigOpen(false)
    setIsTriggerSidebarOpen(true)
  }, [])

  // Handle action removal
  const handleActionRemove = React.useCallback(async (actionId: string) => {
    try {
      console.log('Removing action:', actionId)
      
      // Show loading toast and prevent page reload
      showToast('loading', 'Removing action')
      window.addEventListener('beforeunload', preventReload)

      // First remove the listener from the database
      const result = await saveChanges({
        listener: undefined // Use undefined to match the type
      })

      if (!result || result.status !== 200) {
        throw new Error(result?.data || 'Failed to remove listener')
      }

      // After successful database update, update UI state
      setNodes(nds => {
        const filteredNodes = nds.filter(n => n.id !== actionId)
        return [...filteredNodes, {
          id: 'placeholder-1',
          type: 'placeholder',
          position: { x: 600, y: 190 },
          data: { 
            label: 'Add Action',
            onActionSelect: handleActionSelect
          }
        }]
      })
      
      setEdges(eds => {
        const filteredEdges = eds.filter(e => e.target !== actionId)
        return [...filteredEdges, {
          id: 'edge-placeholder',
          source: 'trigger-1',
          target: 'placeholder-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }]
      })
      
      // Clear selected actions and action node state
      setSelectedActions([])
      actionNodeStateRef.current = null

      // Force immediate refetch to ensure UI and database are in sync
      await queryClient.invalidateQueries({ 
        queryKey: ['automation-info', id],
        exact: true,
        refetchType: 'all'
      })

      // Remove reload prevention and show success
      window.removeEventListener('beforeunload', preventReload)
      showToast('success', 'Action removed successfully')
    } catch (error) {
      console.error('Error removing action:', error)
      // Remove reload prevention
      window.removeEventListener('beforeunload', preventReload)
      toast.error('Failed to remove action')
      // Revert UI changes on error
      queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
    }
  }, [setNodes, setEdges, saveChanges, queryClient, id, showToast])

  // Handle action selection from modal
  const handleActionSelect = React.useCallback(async (actionId: string, actionType: 'MESSAGE' | 'OMNIAI', actionName: string, icon: React.ComponentType<any>, config?: any) => {
    try {
      // First check the database state with proper typing
      const currentState = await queryClient.getQueryData(['automation-info', id]) as { data?: AutomationData }
      if (currentState?.data?.listener) {
        toast.error('Please remove the current action before adding a new one.')
        setIsActionModalOpen(false)
        return
      }

      // Show loading toast and prevent page reload
      showToast('loading', 'Adding new action')
      window.addEventListener('beforeunload', preventReload)

      // Create new action node with correct structure
      const actionNode: Node = {
        id: actionId,
        type: 'action',
        position: { x: 600, y: 190 },
        data: {
          id: actionId,
          listener: {
            listener: actionType,
            prompt: '',
            message: config?.message || '',
            commentReply: null,
            dmCount: 0,
            commentCount: 0
          }
        }
      }

      // Update nodes and edges
      setNodes(nds => {
        const filteredNodes = nds.filter(n => !n.id.startsWith('placeholder'))
        return [...filteredNodes, actionNode]
      })

      setEdges(eds => {
        const newEdge = {
          id: `edge-${actionId}`,
          source: 'trigger-1',
          target: actionId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }
        return [...eds.filter(e => !e.target.startsWith('placeholder')), newEdge]
      })

      // Update selected actions and show sidebar
      setSelectedActions([{ id: actionId, name: actionName, icon }])
      setIsTriggerConfigOpen(true)
      actionNodeStateRef.current = actionNode
      
      // Save the action type to the database with correct structure
      await saveChanges({
        listener: {
          type: actionType,
          status: config?.message ? 'CONFIGURED' : 'UNCONFIGURED',
          prompt: '',
          message: config?.message || '',
          commentReply: null,
          dmCount: 0,
          commentCount: 0
        }
      })

      // Remove reload prevention and show success toast
      window.removeEventListener('beforeunload', preventReload)
      showToast('success', 'Action added successfully')
      
      // Close the action modal
      setIsActionModalOpen(false)

      // Force immediate refetch to ensure UI and database are in sync
      await queryClient.invalidateQueries({ 
        queryKey: ['automation-info', id],
        exact: true,
        refetchType: 'all'
      })
    } catch (error) {
      console.error('Error adding action:', error)
      
      // Remove reload prevention
      window.removeEventListener('beforeunload', preventReload)
      
      // Show error toast
      toast.error('Failed to add action')
      
      // Revert UI changes
      setNodes(nds => {
        const filteredNodes = nds.filter(n => n.id !== actionId)
        return [...filteredNodes, {
          id: 'placeholder-1',
          type: 'placeholder',
          position: { x: 600, y: 190 },
          data: { 
            label: 'Add Action',
            onActionSelect: handleActionSelect
          }
        }]
      })
      
      setEdges(eds => {
        const filteredEdges = eds.filter(e => e.target !== actionId)
        return [...filteredEdges, {
          id: 'edge-placeholder',
          source: 'trigger-1',
          target: 'placeholder-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }]
      })
      
      setSelectedActions([])
      actionNodeStateRef.current = null
      setIsActionModalOpen(false)
    }
  }, [nodes, selectedActions, setNodes, setEdges, saveChanges, showToast, preventReload, queryClient, id])

  // Add a new function to handle message updates
  const handleMessageUpdate = React.useCallback((actionId: string, message: string) => {
    // Update the node data
    setNodes(nds => nds.map(node => {
      if (node.id === actionId) {
        return {
          ...node,
          data: {
            ...node.data,
            listener: {
              ...node.data.listener,
              message
            }
          }
        }
      }
      return node
    }))

    // Save the updated message to the database
    saveChanges({
      listener: {
        type: 'MESSAGE',
        status: 'CONFIGURED',
        message
      }
    })
  }, [setNodes, saveChanges])

  // Add a new function to handle prompt updates
  const handlePromptUpdate = React.useCallback((actionId: string, prompt: string) => {
    // Update nodes with new prompt
    setNodes(nds => nds.map(node => {
      if (node.id === actionId) {
        return {
          ...node,
          data: {
            ...node.data,
            listener: {
              ...node.data.listener,
              prompt,
              status: 'CONFIGURED'
            }
          }
        }
      }
      return node
    }))

    // Save changes to the database
    saveChanges({
      listener: {
        type: 'OMNIAI',
        status: 'CONFIGURED',
        prompt
      }
    })
  }, [setNodes, saveChanges])

  // Initialize flow with data
  React.useEffect(() => {
    if (data?.data && !isInitializedRef.current) {
      const automationData = data.data as unknown as Partial<AutomationData>
      const initialNodes: Node[] = []
      const initialEdges: Edge[] = []

      // Initialize selected triggers from saved data
      if (automationData.trigger && automationData.trigger.length > 0) {
        const savedTrigger = automationData.trigger[0]
        console.log('Initializing trigger from data:', savedTrigger)

        // Map API trigger type to UI type with simplified mapping
        let triggerType = savedTrigger.type
        if (triggerType === 'user-message') {
          triggerType = 'DM'
        } else if (triggerType === 'post-comments') {
          triggerType = 'COMMENT'
        }

        const triggerDetails = getTriggerDetails(triggerType)
        console.log('Mapped trigger details:', { 
          originalType: savedTrigger.type, 
          mappedType: triggerType, 
          details: triggerDetails 
        })

        if (triggerDetails) {
          const trigger = {
            id: triggerType,
            name: triggerDetails.name,
            icon: triggerDetails.icon
          }
          setSelectedTriggers([trigger])
          
          // Set the selected trigger for configuration with API type mapping
          const mappedTrigger = {
            ...trigger,
            id: trigger.id === 'COMMENT' ? 'post-comments' :
                trigger.id === 'DM' ? 'user-message' :
                trigger.id
          }
          setSelectedTriggerForConfig(mappedTrigger)
        }
      }

      // Add trigger node
      const triggerNode: Node = {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: {
          type: automationData.trigger?.[0]?.type ?? 'New Trigger',
          keywords: automationData.trigger?.[0]?.keywords ?? [],
          selectedActions,
          selectedTriggers,
          onTriggerSelect: handleTriggerSelect,
          onTriggerRemove: handleTriggerRemove,
          onActionSelect: handleActionSelect,
          onActionRemove: handleActionRemove,
          isConfigSidebarOpen: isTriggerConfigOpen,
          onConfigSidebarClose: () => setIsTriggerConfigOpen(false),
          onConfigSidebarOpen: () => setIsTriggerConfigOpen(true),
          isTriggerSidebarOpen,
          onTriggerSidebarOpen: () => setIsTriggerSidebarOpen(true),
          onTriggerSidebarClose: () => setIsTriggerSidebarOpen(false),
          onTriggerConfigurationOpen: handleTriggerConfigurationOpen,
          config: automationData.trigger?.[0]?.config,
          configurationStatus: automationData.trigger?.[0]?.config 
            ? getConfigurationStatus(automationData.trigger[0].config as TriggerConfig)
            : 'unconfigured'
        }
      }
      initialNodes.push(triggerNode)

      // Handle action node initialization
      if (automationData.listener) {
        console.log('Initializing action from data:', automationData.listener)
        
        // Create action node
        const actionNode = {
          id: 'action-1',
          type: 'action',
          position: { x: triggerNode.position.x + 600, y: 190 },
          data: {
            id: 'action-1',
            listener: {
              listener: automationData.listener.type, // Use the correct field from database
              prompt: automationData.listener.prompt || '',
              message: automationData.listener.message || '',
              commentReply: automationData.listener.commentReply,
              dmCount: automationData.listener.dmCount,
              commentCount: automationData.listener.commentCount
            }
          }
        }
        initialNodes.push(actionNode)
        actionNodeStateRef.current = actionNode

        // Set selected action
        const actionIcon = automationData.listener.type === 'MESSAGE' ? MessageSquare : Bot
        setSelectedActions([{
          id: 'action-1',
          name: automationData.listener.type === 'MESSAGE' ? 'Send Message' : 'AI Assistant',
          icon: actionIcon
        }])

        // Add edge
        initialEdges.push({
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        })
      } else {
        // Add placeholder if no action exists
        const placeholderNode: Node = {
          id: 'placeholder-1',
          type: 'placeholder',
          position: { x: triggerNode.position.x + 600, y: 190 },
          data: { 
            label: 'Add Action',
            onActionSelect: handleActionSelect
          }
        }
        initialNodes.push(placeholderNode)

        initialEdges.push({
          id: 'edge-placeholder',
          source: 'trigger-1',
          target: 'placeholder-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        })
      }

      setNodes(initialNodes)
      setEdges(initialEdges)
      isInitializedRef.current = true
    }
  }, [
    data?.data,
    selectedActions,
    selectedTriggers,
    handleTriggerSelect,
    handleTriggerRemove,
    handleActionSelect,
    handleActionRemove,
    isTriggerConfigOpen,
    isTriggerSidebarOpen,
    setNodes,
    setEdges
  ])

  // Sync action node state with nodes
  React.useEffect(() => {
    if (actionNodeStateRef.current) {
      const actionNodeExists = nodes.some(node => node.id === actionNodeStateRef.current?.id)
      if (!actionNodeExists) {
        // If the action node was removed, clear the ref
        actionNodeStateRef.current = null
      }
    }
  }, [nodes])

  // Handle node changes
  const onNodesChangeCustom = React.useCallback((changes: NodeChange[]) => {
    onNodesChange(changes)
    
    // Ensure action node state persists through changes
    if (actionNodeStateRef.current) {
      const actionNodeExists = changes.every(change => 
        change.type !== 'remove' || change.id !== actionNodeStateRef.current?.id
      )
      
      if (actionNodeExists) {
        setNodes(nds => 
          nds.map(node => 
            node.id === actionNodeStateRef.current?.id ? 
            { ...node, type: 'action', data: actionNodeStateRef.current.data } : 
            node
          )
        )
      }
    }
  }, [onNodesChange, setNodes])

  const onConnect = React.useCallback(
    (params: Connection) => {
      // Only allow one connection from trigger to action or placeholder
      if (params.source && 
          (params.target?.startsWith('placeholder') || params.target?.startsWith('action')) && 
          params.source.startsWith('trigger')) {
        
        if (params.target?.startsWith('placeholder')) {
          // Convert placeholder to action node
          const placeholderNode = nodes.find(n => n.id === params.target)
          if (placeholderNode) {
            const actionNode: Node = {
              id: `action-${nodes.length + 1}`,
              type: 'action',
              position: placeholderNode.position,
              data: {
                listener: {
                  listener: 'MESSAGE',
                  prompt: '',
                  commentReply: null,
                  dmCount: 0,
                  commentCount: 0
                }
              }
            }
            
            actionNodeStateRef.current = actionNode
            setNodes(nds => [
              ...nds.filter(n => n.id !== params.target),
              actionNode
            ])
            
            // Add edge to the new action node
            setEdges(eds => addEdge({
              ...params,
              target: actionNode.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#94a3b8', strokeWidth: 2 }
            }, eds))
          }
        } else {
          // Normal connection between trigger and action
          setEdges(eds => addEdge({
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 }
          }, eds))
        }
      } else {
        toast.error('Invalid connection. Connect trigger to action only.')
      }
    },
    [nodes, setNodes, setEdges]
  )

  // Handle node click
  const onNodeClick = React.useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    // Open FlowConfigSidebar when clicking on trigger node
    if (node.type === 'trigger') {
      setIsTriggerConfigOpen(true)
    }
  }, [])

  // Sync nodes with selected actions
  React.useEffect(() => {
    const actionNode = nodes.find(n => n.type === 'action')
    const hasSelectedAction = selectedActions.length > 0
    
    // If there's a mismatch between nodes and selected actions, fix it
    if (actionNode && !hasSelectedAction) {
      // Remove orphaned action node
      setNodes(nds => {
        const filteredNodes = nds.filter(n => n.id !== actionNode.id)
        return [...filteredNodes, {
          id: 'placeholder-1',
          type: 'placeholder',
          position: { x: 600, y: 190 },
          data: { 
            label: 'Add Action',
            onActionSelect: handleActionSelect
          }
        }]
      })
      
      // Clean up edges
      setEdges(eds => {
        const filteredEdges = eds.filter(e => e.target !== actionNode.id)
        return [...filteredEdges, {
          id: 'edge-placeholder',
          source: 'trigger-1',
          target: 'placeholder-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }]
      })
      
      actionNodeStateRef.current = null
    }
  }, [nodes, selectedActions, setNodes, setEdges])

  // Handle choosing next step from sidebar
  const handleChooseNextStep = () => {
    setIsActionModalOpen(true)
  }

  // Handle sidebar close
  const handleTriggerConfigClose = React.useCallback(() => {
    setIsTriggerConfigOpen(false)
    setIsActionModalOpen(false)
  }, [])

  // Sync nodes with selected triggers
  React.useEffect(() => {
    setNodes(nds => 
      nds.map(node => {
        if (node.type === 'trigger') {
          return {
            ...node,
            data: {
              ...node.data,
              selectedTriggers,
              onTriggerSelect: handleTriggerSelect,
              onTriggerRemove: handleTriggerRemove,
              isTriggerSidebarOpen,
              onTriggerSidebarOpen: () => setIsTriggerSidebarOpen(true),
              onTriggerSidebarClose: () => setIsTriggerSidebarOpen(false),
              onTriggerConfigurationOpen: handleTriggerConfigurationOpen
            }
          }
        }
        return node
      })
    )
  }, [selectedTriggers, isTriggerSidebarOpen, handleTriggerSelect, handleTriggerRemove, handleTriggerConfigurationOpen])

  const handleTriggerConfig = React.useCallback((type: string, config: TriggerConfig | null) => {
    // Get existing config from nodes
    const existingNode = nodes.find(node => node.type === 'trigger')
    const existingConfig = existingNode?.data?.config || {}
    
    if (!config) {
      // When removing post, preserve keywords and replyMessages but clear post-specific fields
      const updatedConfig = {
        ...existingConfig,
        type: undefined,
        postId: undefined,
        mediaType: undefined,
        mediaUrl: undefined,
        caption: undefined,
        // Preserve existing keywords and replyMessages
        keywords: existingConfig.keywords,
        replyMessages: existingConfig.replyMessages
      }

      // Calculate status based on remaining configurations
      const hasKeywords = updatedConfig.keywords?.include?.length > 0
      const hasReplyMessages = updatedConfig.replyMessages?.length > 0
      
      updatedConfig.status = (hasKeywords || hasReplyMessages) ? 'partial' : 'unconfigured'

      setTriggerConfig(prev => ({
        ...prev,
        [type]: updatedConfig
      }))

      // Update nodes with updated configuration
      setNodes(nds => nds.map(node => {
        if (node.type === 'trigger') {
          return {
            ...node,
            data: {
              ...node.data,
              config: updatedConfig,
              configurationStatus: updatedConfig.status
            }
          }
        }
        return node
      }))

      // Save the updated configuration
      saveChanges({
        trigger: [{
          type,
          config: updatedConfig
        }]
      })
      
      return
    }

    // Rest of the existing code for handling non-null config...
    const mergedConfig = {
      ...existingConfig,
      ...config,
      // Ensure we preserve existing arrays/objects if they exist and handle null/undefined
      keywords: config.keywords || existingConfig.keywords || undefined,
      replyMessages: config.replyMessages || existingConfig.replyMessages || undefined,
      status: getConfigurationStatus({
        ...existingConfig,
        ...config,
        keywords: config.keywords || existingConfig.keywords || undefined,
        replyMessages: config.replyMessages || existingConfig.replyMessages || undefined,
      })
    }

    setTriggerConfig(prev => ({
      ...prev,
      [type]: mergedConfig
    }))

    // Update nodes with merged configuration
    setNodes(nds => nds.map(node => {
      if (node.type === 'trigger') {
        return {
          ...node,
          data: {
            ...node.data,
            config: mergedConfig,
            configurationStatus: mergedConfig.status
          }
        }
      }
      return node
    }))

    // Save the merged configuration
    saveChanges({
      trigger: [{
        type,
        config: mergedConfig
      }]
    })
  }, [nodes, saveChanges, setNodes])

  const nodeTypes = React.useMemo(() => ({
    trigger: TriggerNode,
    action: (props: any) => (
      <ActionNode 
        {...props} 
        onMessageUpdate={handleMessageUpdate}
        onPromptUpdate={handlePromptUpdate}
      />
    ),
    placeholder: PlaceholderNode
  }), [handleMessageUpdate, handlePromptUpdate])

  // Replace the TriggerConfigurationSidebar with dynamic component
  const TriggerConfigComponent = selectedTriggerForConfig 
    ? getTriggerConfigComponent(selectedTriggerForConfig.id)
    : null

  // Handle trigger configuration open/close
  const handleTriggerConfigurationClose = React.useCallback(() => {
    setIsTriggerConfigurationOpen(false)
  }, [])

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeCustom}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="w-full h-full bg-gray-50"
        minZoom={0.5}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={proOptions}
      >
        <Background 
          color="#64748b"
          gap={20} 
          size={1.5}
          variant={BackgroundVariant.Dots}
          className="opacity-50"
        />
        <Controls 
          className="!left-4 flex flex-col gap-0.5"
          showInteractive={false}
          style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '4px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <MiniMap 
          className="bg-white border shadow-sm !bottom-4 !right-4"
          nodeColor="#94a3b8"
          nodeStrokeColor="#64748b"
          nodeStrokeWidth={2}
          maskColor="rgba(240, 240, 240, 0.6)"
          style={{ width: 120, height: 80 }}
        />
      </ReactFlow>

      {/* Flow Config Sidebar */}
      <FlowConfigSidebar
        isOpen={isTriggerConfigOpen}
        onClose={handleTriggerConfigClose}
        onChooseNextStep={handleChooseNextStep}
        onNewTrigger={handleNewTrigger}
        selectedTriggers={selectedTriggers}
        onTriggerRemove={handleTriggerRemove}
        selectedActions={selectedActions}
        onActionRemove={handleActionRemove}
        showChooseNextStep={selectedActions.length === 0}
        onTriggerConfigurationOpen={handleTriggerConfigurationOpen}
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSelect={handleActionSelect}
      />

      {/* Trigger Sidebar */}
      <TriggerSidebar
        isOpen={isTriggerSidebarOpen}
        onClose={() => setIsTriggerSidebarOpen(false)}
        onSelect={handleTriggerSelect}
        selectedTriggers={selectedTriggers}
      />

      {/* Replace the existing TriggerConfigurationSidebar */}
      {TriggerConfigComponent && (
        <TriggerConfigComponent
          isOpen={isTriggerConfigurationOpen}
          onClose={handleTriggerConfigurationClose}
          automationId={id}
          onTriggerConfig={handleTriggerConfig}
        />
      )}
    </div>
  )
}

export default FlowBuilder