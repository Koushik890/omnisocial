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

export interface TriggerData {
  id: string;
  type: string;
  status: 'unconfigured' | 'partial' | 'complete';
  automationId: string | null;
  posts: AutomationPost[];
  keywords: AutomationKeyword[];
  replyMessages: AutomationReplyMessage[];
  config?: TriggerConfig;
}

export interface AutomationData {
  id: string;
  trigger: TriggerData[];
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

export interface TriggerConfig {
  status: TriggerConfigurationStatus
  type?: 'specific' | 'all' | 'next'
  posts?: Array<{
    postId: string
    mediaType: string
    mediaUrl: string
    caption?: string
  }>
  postId?: string
  mediaType?: string
  mediaUrl?: string
  caption?: string
  keywords?: {
    include: string[]
  }
  replyMessages?: string[]
}

export type TriggerConfigurationStatus = 'unconfigured' | 'partial' | 'complete'