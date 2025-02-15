import { ACTION_TYPE } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { addListener } from '@/actions/automations/queries'
import { Automation } from '@prisma/client'
import { useState } from 'react'

interface ActionModalProps {
  automation: Automation | null
  onClose: () => void
}

export default function ActionModal({ automation, onClose }: ActionModalProps) {
  const router = useRouter()
  const [selectedAction, setSelectedAction] = useState<ACTION_TYPE>('MESSAGE')
  const [prompt, setPrompt] = useState('')
  const [reply, setReply] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!automation) return

    try {
      await addListener(
        automation.id,
        selectedAction,
        prompt,
        reply
      )
      onClose()
      router.refresh()
    } catch (error) {
      console.error('Error adding listener:', error)
    }
  }

  // ... rest of component code ...
} 