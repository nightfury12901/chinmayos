'use client';
import { WallpaperCanvas } from './WallpaperCanvas';
import { DesktopIcon } from './DesktopIcon';
import { Taskbar } from './Taskbar';
import { WindowManager } from '@/core/window/WindowManager';
import { AchievementToast } from './AchievementToast';
import { PixelCharacters } from './PixelCharacters';
import { EasterEggs } from './EasterEggs';
import { APP_REGISTRY } from '@/core/apps/registry';
import { TopBar } from './TopBar';
import { SystemStatusWidget } from './widgets/SystemStatusWidget';
import { NotificationsWidget } from './widgets/NotificationsWidget';
import { DailyQuestsWidget } from './widgets/DailyQuestsWidget';

export function Desktop() {
  const desktopApps = APP_REGISTRY; // Use all apps

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: 'var(--font-family)', background: '#0a0608' }}>
      {/* Top Bar */}
      <TopBar />

      {/* Wallpaper */}
      <WallpaperCanvas />

      {/* Desktop icons — 2 columns */}
      <div
        className="absolute left-6 z-10 flex flex-wrap flex-col gap-x-12 gap-y-2 h-[80%]"
        style={{ top: '60px', width: '220px' }}
      >
        {desktopApps.map((app) => (
          <DesktopIcon key={app.id} appId={app.id} icon={app.icon} name={app.name} />
        ))}
      </div>

      {/* Widgets */}
      <SystemStatusWidget />
      <NotificationsWidget />
      <DailyQuestsWidget />

      {/* Hidden easter eggs */}
      <EasterEggs />

      {/* Windows */}
      <WindowManager />

      {/* Pixel characters walking across the bottom */}
      <PixelCharacters />

      {/* Taskbar */}
      <Taskbar />

      {/* Achievement toasts */}
      <AchievementToast />
    </div>
  );
}
