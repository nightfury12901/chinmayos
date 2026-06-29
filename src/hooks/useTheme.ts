'use client';
import { useSettingsStore } from '@/store/settingsStore';
import { THEMES } from '@/core/theme/themes';
import type { ThemeId } from '@/types/theme.types';

export function useTheme() {
  const { theme, setTheme } = useSettingsStore();
  const currentTheme = THEMES[theme];
  return { theme, currentTheme, setTheme, allThemes: Object.values(THEMES) };
}
