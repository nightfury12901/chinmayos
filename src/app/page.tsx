'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BootScreen } from '@/core/boot/BootScreen';
import { SetupScreen } from '@/components/SetupScreen';
import { Desktop } from '@/components/Desktop';
import { useUserStore } from '@/store/userStore';
import { useFSStore } from '@/store/fsStore';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { useSettingsStore } from '@/store/settingsStore';

type Phase = 'boot' | 'setup' | 'desktop';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('boot');
  const profile = useUserStore((s) => s.profile);
  const initFS = useFSStore((s) => s.init);
  const setTheme = useSettingsStore((s) => s.setTheme);

  useEffect(() => {
    initFS();
    // Default to the new dark (band5051-style) theme
    setTheme('dark');
  }, [initFS, setTheme]);

  const handleBootComplete = () => {
    if (profile?.isSetupComplete) {
      setPhase('desktop');
    } else {
      setPhase('setup');
    }
  };

  return (
    <ThemeProvider>
      <div className="w-screen h-screen overflow-hidden" style={{ background: '#0a0608' }}>
        <AnimatePresence mode="wait">
          {phase === 'boot' && (
            <BootScreen key="boot" onComplete={handleBootComplete} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'setup' && (
            <SetupScreen key="setup" onComplete={() => setPhase('desktop')} />
          )}
        </AnimatePresence>

        {phase === 'desktop' && <Desktop />}
      </div>
    </ThemeProvider>
  );
}
