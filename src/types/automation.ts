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
  automationId: string | null;
}

export interface AutomationData {
  id: string;
  trigger: {
    id: string;
    type: string;
    config?: any;
    automationId: string | null;
  }[];
  keywords: AutomationKeyword[];
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