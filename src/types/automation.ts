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
  trigger: { type: string }[];
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