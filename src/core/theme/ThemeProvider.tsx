'use client';
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { THEMES, applyThemeToCSSVars } from './themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const t = THEMES[theme];
    if (t) applyThemeToCSSVars(t);
  }, [theme]);

  return <>{children}</>;
}
