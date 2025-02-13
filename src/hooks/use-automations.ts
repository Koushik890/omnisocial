'use client';

import { z } from 'zod'
import {
  createAutomations,
  deleteKeyword,
  saveKeyword,
  saveListener,
  savePosts,
  saveTrigger,
  removeTrigger,
  updateAutomationName,
} from '@/actions/automations'
import { useMutationData } from './use-mutation-data'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import useZodForm from './use-zod-form'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { TRIGGER } from '@/redux/slices/automation'
import { useQueryClient } from '@tanstack/react-query'
import { useQueryUser, useQueryAutomation } from './user-queries'
import { SUBSCRIPTION_PLAN } from '@prisma/client'
import { toast } from 'sonner'

export const useCreateAutomation = (id?: string) => {
  const { isPending, mutate } = useMutationData(
    ['create-automation'],
    async (variables: { id?: string }) => {
      try {
        const result = await createAutomations(variables.id);
        if (!result) {
          throw new Error('No response from server');
        }
        
        if (result.status !== 200) {
          throw new Error(result.data || 'Failed to create automation');
        }
        
        // Get the created automation from the response
        const automation = result.res;
        if (!automation?.id) {
          throw new Error('No automation ID in response');
        }

        return {
          status: 200,
          data: 'Automation created successfully',
          res: {
            id: automation.id,
            name: automation.name || 'Untitled',
            status: 'DRAFT',
            active: false,
            updatedAt: new Date(),
            config: null
          }
        };
      } catch (error) {
        console.error('Error creating automation:', error);
        throw error;
      }
    },
    'user-automations'
  );

  return { isPending, mutate };
};

export const useEditAutomation = (automationId: string) => {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isUpdatingRef = useRef(false);
  const lastValueRef = useRef<string>('');

  const enableEdit = () => setEdit(true);
  const disableEdit = useCallback(() => setEdit(false), []);

  const { isPending, mutate } = useMutationData(
    ['update-automation'],
    async (data: { name: string }) => {
      if (!data.name || !data.name.trim()) {
        throw new Error('Name cannot be empty');
      }
      const result = await updateAutomationName(automationId, { name: data.name.trim() });
      if (result.status !== 200) {
        throw new Error(result.data || 'Failed to update name');
      }
      return result;
    },
    'automation-info'
  );

  const handleUpdateName = useCallback((value: string) => {
    if (!value || !value.trim() || isUpdatingRef.current || value.trim() === lastValueRef.current) {
      return;
    }
    
    isUpdatingRef.current = true;
    lastValueRef.current = value.trim();
    
    mutate(
      { name: value.trim() },
      {
        onSuccess: () => {
          disableEdit();
          isUpdatingRef.current = false;
        },
        onError: () => {
          isUpdatingRef.current = false;
          lastValueRef.current = '';
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    );
  }, [mutate, disableEdit]);

  useEffect(() => {
    if (!edit) {
      isUpdatingRef.current = false;
      lastValueRef.current = '';
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node | null)
      ) {
        const value = inputRef.current.value;
        if (value && value.trim()) {
          handleUpdateName(value);
        } else {
          disableEdit();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [edit, handleUpdateName, disableEdit]);

  return {
    edit,
    enableEdit,
    disableEdit,
    inputRef,
    isPending,
  };
}

// Add this type to define what can be saved
interface AutomationState {
  trigger?: {
    type: string;
    config?: any;
  }[];
  listener?: {
    type: 'MESSAGE' | 'OMNIAI';
    prompt?: string;
    reply?: string;
  };
  keywords?: string[];
  posts?: {
    postid: string;
    caption?: string;
    media: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM';
  }[];
  name?: string;
  active?: boolean;
}

// Add this hook to handle auto-saving
export const useAutomationSync = (id: string) => {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const queryClient = useQueryClient()
  const { data: automationData } = useQueryAutomation(id)

  const saveToDatabase = async (state: Partial<AutomationState>) => {
    try {
      setIsSaving(true)
      
      // Save each part of the state
      const promises = []
      
      if (state.trigger !== undefined) {
        if (state.trigger.length === 0) {
          promises.push(removeTrigger(id))
        } else {
          const triggerPromises = state.trigger.map(trigger => {
            return saveTrigger(id, [trigger.type], trigger.config || undefined)
          })
          promises.push(Promise.all(triggerPromises))
        }
      }
      
      if (state.listener) {
        promises.push(saveListener(
          id,
          state.listener.type,
          state.listener.prompt || '',
          state.listener.reply || ''
        ))
      }
      
      if (state.keywords) {
        promises.push(Promise.all(
          state.keywords.map(keyword => saveKeyword(id, keyword))
        ))
      }
      
      if (state.posts) {
        promises.push(savePosts(id, state.posts))
      }
      
      if (state.name) {
        promises.push(updateAutomationName(id, { name: state.name }))
      }

      await Promise.all(promises)
      
      // Update cache and show success
      queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving automation:', error)
      toast.error('Failed to save changes')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const debouncedSave = useCallback((state: Partial<AutomationState>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToDatabase(state)
    }, 1000) // Debounce for 1 second
  }, [])

  // Initialize automation with default state if it's new
  useEffect(() => {
    if (automationData?.data && !automationData.data.name) {
      debouncedSave({
        name: 'Untitled',
        active: false,
        trigger: [],
        keywords: [],
        listener: {
          type: 'MESSAGE',
          prompt: '',
          reply: ''
        }
      })
    }
  }, [automationData?.data, debouncedSave])

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    isSaving,
    lastSaved,
    saveChanges: debouncedSave
  }
}

// Update useTriggers to use auto-save
export const useTriggers = (id: string) => {
  const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)
  const queryClient = useQueryClient()
  const dispatch: AppDispatch = useDispatch()
  const { data: automationData } = useQueryAutomation(id)
  const { saveChanges } = useAutomationSync(id)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Redux state from database data
  useEffect(() => {
    if (!automationData?.data || isInitialized) return

    console.log('Raw automation data:', automationData.data)
    
    if (automationData.data.trigger && automationData.data.trigger.length > 0) {
      const trigger = automationData.data.trigger[0]
      console.log('Raw trigger data:', trigger)

      // Map API type to UI type with explicit type checking
      let uiType: 'COMMENT' | 'DM'
      let apiType = trigger.type

      // Strict type mapping with validation
      if (apiType === 'user-message' || apiType === 'DM') {
        uiType = 'DM'
        apiType = 'user-message' // Normalize to API type
      } else if (apiType === 'post-comments' || apiType === 'COMMENT') {
        uiType = 'COMMENT'
        apiType = 'post-comments' // Normalize to API type
      } else {
        console.error('Unknown trigger type:', apiType)
        return
      }

      console.log('Mapped trigger types:', { apiType, uiType })

      // Create configuration object
      const config = {
        status: trigger.status || 'unconfigured',
        type: (trigger as any).config?.type || 'all',
        keywords: {
          include: trigger.keywords?.map(k => k.word) || []
        },
        replyMessages: trigger.replyMessages?.map(r => r.message) || [],
        posts: trigger.posts?.map(p => ({
          postId: p.postId,
          mediaType: p.mediaType.toString(),
          mediaUrl: p.mediaUrl,
          caption: p.caption || undefined
        })) || []
      }

      // Determine configuration status based on data presence
      const hasKeywords = config.keywords.include.length > 0
      const hasReplyMessages = config.replyMessages.length > 0
      const hasPosts = config.posts.length > 0

      const status = hasKeywords && hasReplyMessages && hasPosts ? 'complete' as const :
                    hasKeywords || hasReplyMessages || hasPosts ? 'partial' as const :
                    'unconfigured' as const

      const finalConfig = {
        ...config,
        status
      }

      console.log('Created trigger config:', finalConfig)

      // Update Redux state with validated data
      dispatch(TRIGGER({ 
        trigger: { 
          type: uiType,
          types: [uiType],
          config: finalConfig
        } 
      }))

      console.log('Updated Redux state with trigger:', { uiType, config: finalConfig })
      setIsInitialized(true)
    }
  }, [automationData?.data, dispatch, isInitialized])

  // Handle trigger removal with complete cleanup
  const onRemoveTrigger = useCallback(async () => {
    try {
      console.log('Removing trigger')
      
      // Clear Redux state first
      dispatch(TRIGGER({ 
        trigger: { 
          type: undefined,
          types: [],
          config: undefined,
          keywords: [],
          keyword: undefined
        } 
      }))

      // Remove from database with complete cleanup
      await saveChanges({ 
        trigger: [],
        keywords: [],
        posts: []
      })

      // Force immediate refetch
      await queryClient.invalidateQueries({ 
        queryKey: ['automation-info', id],
        exact: true,
        refetchType: 'all'
      })

      toast.success('Trigger removed successfully')
    } catch (error) {
      console.error('Error removing trigger:', error)
      toast.error('Failed to remove trigger')
    }
  }, [dispatch, saveChanges, queryClient, id])

  // Set trigger with proper initialization
  const onSetTrigger = useCallback(async (type: 'COMMENT' | 'DM') => {
    console.log('Setting trigger type:', type)

    // Map UI trigger type to API trigger type with validation
    const apiType = type === 'DM' ? 'user-message' :
                   type === 'COMMENT' ? 'post-comments' :
                   null

    if (!apiType) {
      console.error('Invalid UI trigger type:', type)
      return
    }

    console.log('Mapped to API type:', apiType)

    try {
      // Create fresh configuration with strict typing
      const initialConfig = {
        status: 'unconfigured' as 'unconfigured' | 'partial' | 'complete',
        type: 'all' as 'all' | 'specific' | 'next',
        keywords: { include: [] as string[] },
        replyMessages: [] as string[],
        posts: [] as Array<{
          postId: string;
          mediaType: string;
          mediaUrl: string;
          caption?: string;
        }>
      }

      console.log('Setting initial config:', initialConfig)

      // Update Redux state with fresh configuration
      dispatch(TRIGGER({ 
        trigger: { 
          type,
          types: [type],
          config: initialConfig,
          keywords: [],
          keyword: undefined
        } 
      }))

      console.log('Updated Redux state')

      // Save to database with complete initialization and normalized type
      await saveChanges({
        trigger: [{
          type: apiType, // Always use API type when saving to database
          config: initialConfig
        }],
        keywords: [],
        posts: []
      })

      console.log('Saved to database with normalized type:', apiType)

      // Force immediate refetch
      await queryClient.invalidateQueries({ 
        queryKey: ['automation-info', id],
        exact: true,
        refetchType: 'all'
      })

      console.log('Invalidated queries')
      toast.success('Trigger initialized successfully')
    } catch (error) {
      console.error('Error initializing trigger:', error)
      toast.error('Failed to initialize trigger')

      // Revert Redux state on error
      dispatch(TRIGGER({ 
        trigger: { 
          types: [],
          config: undefined,
          keywords: [],
          keyword: undefined
        } 
      }))
    }
  }, [dispatch, saveChanges, queryClient, id])

  return { 
    types, 
    onSetTrigger,
    onRemoveTrigger,
    isInitialized
  }
}

export const useKeywords = (id: string) => {
  const [keyword, setKeyword] = useState('')
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeyword(e.target.value)

  const { mutate } = useMutationData(
    ['add-keyword'],
    (data: { keyword: string }) => saveKeyword(id, data.keyword),
    'automation-info',
    () => setKeyword('')
  )

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      mutate({ keyword })
      setKeyword('')
    }
  }

  const { mutate: deleteMutation } = useMutationData(
    ['delete-keyword'],
    (data: { id: string }) => deleteKeyword(data.id),
    'automation-info'
  )

  return { keyword, onValueChange, onKeyPress, deleteMutation }
}

export const useAutomationPosts = (id: string) => {
  const [posts, setPosts] = useState<
    {
      postid: string
      caption?: string
      media: string
      mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
    }[]
  >([])
  const queryClient = useQueryClient()

  const onSelectPost = (post: {
    postid: string
    caption?: string
    media: string
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'
  }) => {
    setPosts((prevItems) => {
      if (prevItems.find((p) => p.postid === post.postid)) {
        return prevItems.filter((item) => item.postid !== post.postid)
      } else {
        return [...prevItems, post]
      }
    })
  }

  const { mutate, isPending } = useMutationData(
    ['attach-posts'],
    () => savePosts(id, posts),
    'automation-info',
    () => {
      queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
      setPosts([])
    }
  )
  return { posts, onSelectPost, mutate, isPending }
}

export const useAutomationWorkflow = (id: string) => {
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [actionConfig, setActionConfig] = useState<{
    message?: string
    prompt?: string
    reply?: string
  }>({})
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>({})
  
  const queryClient = useQueryClient()
  const { data: userData } = useQueryUser()
  const { data: automationData } = useQueryAutomation(id)
  const isPro = userData?.data?.subscription?.plan === SUBSCRIPTION_PLAN.PRO
  const { saveChanges } = useAutomationSync(id)

  // Initialize trigger configuration from database
  useEffect(() => {
    if (automationData?.data?.trigger && automationData.data.trigger.length > 0) {
      const trigger = automationData.data.trigger[0]
      
      // Map API type to UI type
      let uiType = trigger.type === 'user-message' ? 'DM' :
                  trigger.type === 'post-comments' ? 'COMMENT' :
                  trigger.type // Keep as is if already UI type

      // Create configuration object with all saved data
      const config = {
        status: trigger.status || 'unconfigured',
        type: (trigger as any).config?.type || 'all',
        keywords: {
          include: trigger.keywords?.map(k => k.word) || []
        },
        replyMessages: trigger.replyMessages?.map(r => r.message) || [],
        posts: trigger.posts?.map(p => ({
          postId: p.postId,
          mediaType: p.mediaType.toString(),
          mediaUrl: p.mediaUrl,
          caption: p.caption || undefined
        })) || []
      }

      // Update both selectedTriggers and triggerConfig states
      setSelectedTriggers([uiType])
      setTriggerConfig({
        [uiType]: config
      })
    }
  }, [automationData?.data])

  const handleTriggerSelect = useCallback(async (type: string, config?: any) => {
    setSelectedTriggers(prev => {
      const newTriggers = prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
      
      // Save changes immediately when triggers are updated
      const save = async () => {
        await saveChanges({
        trigger: newTriggers.map(t => ({
          type: t,
          config: t === type ? config : triggerConfig[t]
        }))
      })
        // Invalidate queries to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
      }
      
      save()
      return newTriggers
    })

    if (config) {
      setTriggerConfig(prev => ({
        ...prev,
        [type]: config
      }))
    }
  }, [saveChanges, triggerConfig, queryClient, id])

  const handleTriggerConfig = useCallback(async (type: string, config: any) => {
    setTriggerConfig(prev => ({
      ...prev,
      [type]: config
    }))

    await saveChanges({
      trigger: selectedTriggers.map(t => ({
        type: t,
        config: t === type ? config : triggerConfig[t]
      }))
    })
    // Invalidate queries to refetch fresh data
    queryClient.invalidateQueries({ queryKey: ['automation-info', id] })
  }, [saveChanges, selectedTriggers, triggerConfig, queryClient, id])

  const handleActionSelect = useCallback((type: string) => {
    setSelectedAction(type)
  }, [])

  const handleActionConfig = useCallback((config: typeof actionConfig) => {
    setActionConfig(config)
  }, [])

  const { mutate: saveTrigger, isPending: isSavingTrigger } = useMutationData(
    ['save-trigger'],
    async () => {
      const response = await fetch('/api/automations/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automationId: id,
          triggers: selectedTriggers,
        }),
      })
      return response.json()
    },
    'automation-info'
  )

  const { mutate: saveAction, isPending: isSavingAction } = useMutationData(
    ['save-action'],
    async () => {
      const response = await fetch('/api/automations/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automationId: id,
          action: selectedAction,
          config: actionConfig,
        }),
      })
      return response.json()
    },
    'automation-info'
  )

  const handleSaveTrigger = useCallback(() => {
    if (selectedTriggers.length > 0) {
      saveTrigger({
        automationId: id,
        triggers: selectedTriggers
      })
    }
  }, [selectedTriggers, saveTrigger, id])

  const handleSaveAction = useCallback(() => {
    if (selectedAction && Object.keys(actionConfig).length > 0) {
      saveAction({
        automationId: id,
        action: selectedAction,
        config: actionConfig
      })
    }
  }, [selectedAction, actionConfig, saveAction, id])

  return {
    selectedTriggers,
    selectedAction,
    actionConfig,
    triggerConfig,
    isPro,
    isSavingTrigger,
    isSavingAction,
    handleTriggerSelect,
    handleTriggerConfig,
    handleActionSelect,
    handleActionConfig,
    handleSaveTrigger,
    handleSaveAction,
  }
}

// Update useListener to use auto-save
export const useListener = (id: string) => {
  const [listener, setListener] = useState<'MESSAGE' | 'OMNIAI' | null>(null)
  const { saveChanges } = useAutomationSync(id)

  const promptSchema = z.object({
    prompt: z.string().min(1),
    reply: z.string(),
  })

  const onFormSubmit = useCallback((data: { prompt: string; reply: string }) => {
    if (listener) {
      saveChanges({
        listener: {
          type: listener,
          prompt: data.prompt,
          reply: data.reply
        }
      })
    }
  }, [listener, saveChanges])

  const onSetListener = useCallback((type: 'OMNIAI' | 'MESSAGE') => {
    setListener(type)
  }, [])

  return { onSetListener, onFormSubmit, listener }
}
