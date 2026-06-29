import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeId } from '@/types/theme.types';

interface Settings {
  theme: ThemeId;
  wallpaper: string;
  soundEnabled: boolean;
  showClock: boolean;
  showXPBar: boolean;
  taskbarPosition: 'bottom' | 'top';
}

interface SettingsStore extends Settings {
  setTheme: (theme: ThemeId) => void;
  setWallpaper: (wallpaper: string) => void;
  toggleSound: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      wallpaper: 'gradient-aurora',
      soundEnabled: true,
      showClock: true,
      showXPBar: true,
      taskbarPosition: 'bottom',

      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      updateSettings: (partial) => set(partial),
    }),
    { name: 'nexos-settings' }
  )
);
