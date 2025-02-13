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
import { Plus, Undo2, Redo2, MessageSquare, Bot, Instagram } from 'lucide-react'
import { toast } from 'sonner'
import { FlowConfigSidebar } from './flow-config-sidebar/index'
import { ActionModal } from './action-modal'
import { TriggerSidebar } from './trigger-sidebar'
import { TriggerConfigurationSidebar } from './trigger-configuration-sidebar'
import { useAutomationWorkflow, useAutomationSync } from '@/hooks/use-automations'

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

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  placeholder: PlaceholderNode
}

// Pro options to remove watermark
const proOptions = { hideAttribution: true }

const getConfigurationStatus = (config?: TriggerConfig): TriggerConfigurationStatus => {
  if (!config) return 'unconfigured'
  if (config.status) return config.status

  // Determine status based on config content
  const hasPost = config.type === 'specific' && config.posts && config.posts.length > 0
  const hasKeywords = (config.keywords?.include ?? []).length > 0
  const hasReplyMessages = (config.replyMessages ?? []).length > 0

  if (hasPost && hasKeywords && hasReplyMessages) return 'complete'
  if (hasPost || hasKeywords || hasReplyMessages) return 'partial'
  return 'unconfigured'
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ id }) => {
  const { data } = useQueryAutomation(id)
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

  // Handle trigger selection
  const handleTriggerSelect = React.useCallback((triggerId: string, triggerName: string, icon: React.ComponentType<any>) => {
    const newTrigger = { id: triggerId, name: triggerName, icon }
    
    // Clear previous trigger configuration
    setTriggerConfig({})
    
    // Set new trigger
    setSelectedTriggers([newTrigger])
    
    // Save the trigger selection with fresh configuration state
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
    setSelectedTriggerForConfig(trigger)
    setIsTriggerConfigurationOpen(true)
  }, [])

  // Handle trigger removal
  const handleTriggerRemove = React.useCallback(async (triggerId: string) => {
    try {
      console.log('Removing trigger:', triggerId)
      
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

      toast.success('Trigger removed successfully')
    } catch (error) {
      console.error('Error removing trigger:', error)
      toast.error('Failed to remove trigger')
    }
  }, [saveChanges, setNodes])

  // Handle new trigger button click
  const handleNewTrigger = React.useCallback(() => {
    setIsTriggerConfigOpen(false)
    setIsTriggerSidebarOpen(true)
  }, [])

  // Handle action removal
  const handleActionRemove = React.useCallback((actionId: string) => {
    // Remove action node and its edges
    setNodes(nds => {
      const filteredNodes = nds.filter(n => n.id !== actionId)
      // Add placeholder node if no actions left
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
      // Always add edge to placeholder when removing action
      return [...filteredEdges, {
        id: 'edge-placeholder',
        source: 'trigger-1',
        target: 'placeholder-1',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 }
      }]
    })
    
    // Remove from selected actions
    setSelectedActions([])
    actionNodeStateRef.current = null
  }, [setNodes, setEdges])

  // Handle action selection from modal
  const handleActionSelect = React.useCallback((actionId: string, actionType: 'MESSAGE' | 'OMNIAI', actionName: string, icon: React.ComponentType<any>) => {
    // Check if there's already an action node
    if (nodes.some(n => n.type === 'action') && selectedActions.length > 0) {
      toast.error('Please remove the current action before adding a new one.')
      setIsActionModalOpen(false)
      return
    }

    // Create new action node
    const actionNode: Node = {
      id: actionId,
      type: 'action',
      position: { x: 600, y: 190 },
      data: {
        id: actionId,
        listener: {
          listener: actionType,
          prompt: '',
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
    
    // Close the action modal
    setIsActionModalOpen(false)
  }, [nodes, selectedActions, setNodes, setEdges])

  // Initialize flow with data
  React.useEffect(() => {
    if (data?.data && !isInitializedRef.current) {
      const automationData = data.data as AutomationData
      const initialNodes: Node[] = []
      const initialEdges: Edge[] = []

      // Initialize selected triggers from saved data without auto-opening configuration
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
          setSelectedTriggers([{
            id: triggerType,
            name: triggerDetails.name,
            icon: triggerDetails.icon
          }])
          // Remove automatic configuration opening
          setSelectedTriggerForConfig(null)
          setIsTriggerConfigurationOpen(false)
        }
      }

      // Add trigger node
      const triggerNode: Node = {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: {
          type: automationData.trigger.length > 0 ? automationData.trigger[0].type : 'New Trigger',
          keywords: automationData.trigger.length > 0 ? automationData.trigger[0].keywords : [],
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
          config: automationData.trigger.length > 0 ? automationData.trigger[0].config : undefined,
          configurationStatus: automationData.trigger.length > 0 
            ? getConfigurationStatus(automationData.trigger[0].config as TriggerConfig)
            : 'unconfigured'
        }
      }
      initialNodes.push(triggerNode)

      // Add placeholder node if no action exists
      if (!automationData.listener) {
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

        // Add edge between trigger and placeholder
        initialEdges.push({
          id: 'edge-placeholder',
          source: 'trigger-1',
          target: 'placeholder-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        })
      } else {
        // Add existing action node and edge
        const actionNode = {
          id: 'action-1',
          type: 'action',
          position: { x: triggerNode.position.x + 600, y: 190 },
          data: {
            listener: automationData.listener
          }
        }
        initialNodes.push(actionNode)
        actionNodeStateRef.current = actionNode

        initialEdges.push({
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1',
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
        <Panel position="top-right" className="flex gap-2 mr-4 mt-4">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 bg-white shadow-lg hover:bg-gray-100 border-gray-200 ring-1 ring-black/5"
            onClick={() => {
              // Add new trigger node
              const newNode: Node = {
                id: `trigger-${nodes.length + 1}`,
                type: 'trigger',
                position: { x: 100, y: 200 },
                data: {
                  type: 'New Trigger',
                  keywords: [],
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
                  onTriggerConfigurationOpen: handleTriggerConfigurationOpen
                }
              }
              setNodes((nds) => [...nds, newNode])
            }}
          >
            <Plus className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 bg-white shadow-lg hover:bg-gray-100 border-gray-200 ring-1 ring-black/5"
            onClick={() => {
              // Undo last action
            }}
          >
            <Undo2 className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 bg-white shadow-lg hover:bg-gray-100 border-gray-200 ring-1 ring-black/5"
            onClick={() => {
              // Redo last action
            }}
          >
            <Redo2 className="h-5 w-5 text-gray-700" />
          </Button>
        </Panel>
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

      {/* Trigger Configuration Sidebar */}
      <TriggerConfigurationSidebar
        isOpen={isTriggerConfigurationOpen}
        onClose={() => setIsTriggerConfigurationOpen(false)}
        selectedTrigger={selectedTriggerForConfig}
        automationId={id}
        onTriggerConfig={handleTriggerConfig}
      />
    </div>
  )
}

export default FlowBuilder