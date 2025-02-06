'use client';

import { z } from 'zod'
import {
  createAutomations,
  deleteKeyword,
  saveKeyword,
  saveListener,
  savePosts,
  saveTrigger,
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
import { useQueryUser } from './user-queries'
import { SUBSCRIPTION_PLAN } from '@prisma/client'

export const useCreateAutomation = (id?: string) => {
  const { isPending, mutate } = useMutationData(
    ['create-automation'],
    async () => {
      const result = await createAutomations(id);
      if (!result || result.status !== 200 || !result.res) {
        throw new Error('Failed to create automation');
      }
      // Get the created automation from the response
      const automation = result.res;
      if (!automation?.id) {
        throw new Error('No automation ID in response');
      }
      return result;
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

export const useListener = (id: string) => {
  const [listener, setListener] = useState<'MESSAGE' | 'OMNIAI' | null>(null)

  const promptSchema = z.object({
    prompt: z.string().min(1),
    reply: z.string(),
  })

  const { isPending, mutate } = useMutationData(
    ['create-lister'],
    (data: { prompt: string; reply: string }) =>
      saveListener(id, listener || 'MESSAGE', data.prompt, data.reply),
    'automation-info'
  )

  const { errors, onFormSubmit, register, reset, watch } = useZodForm(
    promptSchema,
    mutate
  )

  const onSetListener = (type: 'OMNIAI' | 'MESSAGE') => setListener(type)
  return { onSetListener, register, onFormSubmit, listener, isPending }
}

export const useTriggers = (id: string) => {
  const types = useAppSelector((state) => state.AutmationReducer.trigger?.types)

  const dispatch: AppDispatch = useDispatch()

  const onSetTrigger = (type: 'COMMENT' | 'DM') =>
    dispatch(TRIGGER({ trigger: { type } }))

  const { isPending, mutate } = useMutationData(
    ['add-trigger'],
    (data: { types: string[] }) => saveTrigger(id, data.types),
    'automation-info'
  )

  const onSaveTrigger = () => mutate({ types })
  return { types, onSetTrigger, onSaveTrigger, isPending }
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
    () => setPosts([])
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
  
  const queryClient = useQueryClient()
  const { data: userData } = useQueryUser()
  const isPro = userData?.data?.subscription?.plan === SUBSCRIPTION_PLAN.PRO

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

  const handleTriggerSelect = useCallback((type: string) => {
    setSelectedTriggers(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      }
      return [...prev, type]
    })
  }, [])

  const handleActionSelect = useCallback((type: string) => {
    setSelectedAction(type)
  }, [])

  const handleActionConfig = useCallback((config: typeof actionConfig) => {
    setActionConfig(config)
  }, [])

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
    isPro,
    isSavingTrigger,
    isSavingAction,
    handleTriggerSelect,
    handleActionSelect,
    handleActionConfig,
    handleSaveTrigger,
    handleSaveAction,
  }
}
