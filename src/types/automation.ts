import { ReactNode } from 'react';

export interface AutomationTrigger {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: ReactNode;
  disabled?: boolean;
  comingSoon?: boolean;
}

export interface AutomationKeyword {
  id: string;
  word: string;
  triggerId: string;
}

export interface AutomationPost {
  id: string;
  postId: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM';
  mediaUrl: string;
  caption?: string;
  triggerId: string;
}

export interface AutomationReplyMessage {
  id: string;
  message: string;
  triggerId: string;
}

export type TriggerConfig = {
  type: 'specific' | 'all' | 'next'
  postId?: string
  mediaUrl?: string
  keywords?: {
    include: string[]
  }
  replyMessages?: string[]
  status?: TriggerConfigurationStatus
  posts?: {
    postId: string
    mediaType: string
    mediaUrl: string
    caption: string | null
  }[]
}

export interface TriggerData {
  id: string
  type: string
  config?: TriggerConfig
  automationId: string | null
  posts?: {
    id: string
    caption: string | null
    postId: string
    mediaType: string
    mediaUrl: string
    triggerId: string
  }[]
  keywords?: {
    id: string
    triggerId: string
    word: string
  }[]
  replyMessages?: {
    id: string
    triggerId: string
    message: string
  }[]
}

export interface AutomationData {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  trigger: TriggerData[]
  listener: any;
}

export interface AutomationAction {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  upgradeRequired?: boolean;
  savedText?: string;
}

export type TriggerConfigurationStatus = 'unconfigured' | 'partial' | 'complete'