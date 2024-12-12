import { AutomationDuoToneWhite } from '@/icons/automation-duotone-white';
import { HomeDuoToneWhite } from '@/icons/home-duo-tone-white';
import { RocketDuoToneWhite } from '@/icons/rocket-duotone-white';
import { SettingsDuoToneWhite } from '@/icons/settings-duotone-white';
import { v4 as uuid } from 'uuid';

export interface SideBarProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const SIDEBAR_MENU: SideBarProps[] = [
  {
    id: uuid(),
    label: 'home',
    icon: <HomeDuoToneWhite />,
  },
  {
    id: uuid(),
    label: 'automations',
    icon: <AutomationDuoToneWhite />,
  },
  {
    id: uuid(),
    label: 'integrations',
    icon: <RocketDuoToneWhite />,
  },
  {
    id: uuid(),
    label: 'settings',
    icon: <SettingsDuoToneWhite />,
  },
];