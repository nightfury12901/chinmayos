'use client';
import { useWindowStore } from '@/store/windowStore';
import { useXPStore } from '@/store/xpStore';
import { useAchievementStore } from '@/store/achievementStore';
import { useCoinStore } from '@/store/coinStore';
import { APP_REGISTRY, APPS_BY_ID } from '@/core/apps/registry';
import type { WindowConfig } from '@/types/window.types';

export function useWindowManager() {
  const { openWindow, closeWindow, focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const { addXP } = useXPStore();
  const { unlock } = useAchievementStore();
  const { addCoins } = useCoinStore();

  const openAppsCount = useWindowStore((s) => s.windows.length);

  const launchApp = (appId: string, extraProps?: Record<string, unknown>) => {
    const app = APPS_BY_ID[appId];
    if (!app) return;

    const config: WindowConfig = {
      appId,
      title: app.name,
      icon: app.icon,
      defaultWidth: app.windowConfig.defaultWidth,
      defaultHeight: app.windowConfig.defaultHeight,
      minWidth: app.windowConfig.minWidth,
      minHeight: app.windowConfig.minHeight,
      isResizable: app.windowConfig.isResizable,
      props: extraProps,
    };

    const windowId = openWindow(config);
    addXP(app.xpReward, `Opened ${app.name}`);

    // Achievement: first app
    unlock('first_app');

    // Achievement: OS explorer (5 unique apps)
    const openIds = new Set(useWindowStore.getState().windows.map((w) => w.appId));
    if (openIds.size >= 5) unlock('os_explorer');

    // Game achievements
    if (app.category === 'games') unlock('first_game');

    return windowId;
  };

  return {
    launchApp,
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
  };
}
