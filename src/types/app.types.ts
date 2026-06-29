import type { WindowConfig } from './window.types';

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'system' | 'productivity' | 'games' | 'utilities';
  windowConfig: Omit<WindowConfig, 'appId'>;
  component: string; // component key for dynamic lookup
  desktopShortcut: boolean;
  startMenuEntry: boolean;
  xpReward: number;
}

export interface AppInstance {
  windowId: string;
  appId: string;
  launchedAt: number;
}
