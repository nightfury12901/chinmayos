'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { OS_NAME, OS_VERSION } from '@/core/theme/themes';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [audio, setAudio] = useState(true);
  const [mono, setMono] = useState(false);
  const [booting, setBooting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const BOOT_SEQUENCE = [
    `${OS_NAME} v${OS_VERSION} — KERNEL INIT`,
    'Loading virtual filesystem...',
    'Mounting IndexedDB storage... [OK]',
    'Starting window compositor... [OK]',
    'Loading app registry (9 apps)... [OK]',
    'Init achievement subsystem... [OK]',
    'Starting AI assistant... [OK]',
    `Welcome to ${OS_NAME}.`,
  ];

  const handleBoot = () => {
    if (booting) return;
    setBooting(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.round((step / BOOT_SEQUENCE.length) * 100));
      setBootLines((prev) => [...prev, BOOT_SEQUENCE[step - 1]]);
      if (step >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 130);
  };

  return (
    <AnimatePresence>
      {!booting ? (
        <motion.div
          key="config"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#0a0608', fontFamily: "'VT323', monospace" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)',
            zIndex: 1,
          }} />

          {/* Config dialog — myideal.me style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-lg mx-4"
            style={{ border: '2px solid #ee2222', background: '#0a0608', boxShadow: '0 0 40px rgba(238,34,34,0.3)' }}
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-4">
              <div style={{ color: '#ee2222', fontSize: 13, letterSpacing: '0.15em', marginBottom: 8 }}>
                SYSTEM CONFIGURATION
              </div>
              <div style={{ color: '#ffffff', fontSize: 32, fontFamily: "'Press Start 2P', monospace", lineHeight: 1.3 }}>
                {OS_NAME}
              </div>
              <div style={{ color: '#ffcc33', fontSize: 18, marginTop: 4 }}>
                Desktop Display Settings
              </div>
            </div>

            {/* Toggles */}
            <div className="px-8 pb-4 flex flex-col gap-0">
              {/* Audio toggle */}
              <div
                onClick={() => setAudio((v) => !v)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-all"
                style={{
                  border: '1px solid #ee2222',
                  borderBottom: 'none',
                  background: audio ? 'rgba(238,34,34,0.08)' : 'transparent',
                }}
              >
                <span style={{ color: '#ffffff', fontSize: 18, letterSpacing: '0.1em' }}>AUDIO</span>
                <span style={{ color: audio ? '#ffcc33' : '#555555', fontSize: 18, letterSpacing: '0.1em' }}>
                  {audio ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Mono toggle */}
              <div
                onClick={() => setMono((v) => !v)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-all"
                style={{
                  border: '1px solid #ee2222',
                  background: mono ? 'rgba(238,34,34,0.08)' : 'transparent',
                }}
              >
                <span style={{ color: '#ffffff', fontSize: 18, letterSpacing: '0.1em' }}>MONOCHROME MODE</span>
                <span style={{ color: mono ? '#ffcc33' : '#555555', fontSize: 18, letterSpacing: '0.1em' }}>
                  {mono ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Boot button */}
            <div className="px-8 pb-8">
              <motion.button
                whileHover={{ background: '#ee2222', color: '#0a0608' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBoot}
                className="w-full py-4 text-center transition-all select-none cursor-pointer"
                style={{
                  border: '2px solid #ee2222',
                  background: 'transparent',
                  color: '#ee2222',
                  fontSize: 20,
                  fontFamily: "'VT323', monospace",
                  letterSpacing: '0.15em',
                }}
              >
                START {OS_NAME} →
              </motion.button>
            </div>
          </motion.div>

          {/* Version tag */}
          <div className="absolute bottom-4 right-4 z-10" style={{ color: '#333333', fontSize: 13, letterSpacing: '0.1em' }}>
            v{OS_VERSION}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="booting"
          className="fixed inset-0 z-[9999] flex flex-col p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: '#0a0608', fontFamily: "'VT323', monospace" }}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)',
          }} />

          <div className="relative z-10 flex-1 overflow-hidden">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg leading-7"
                style={{
                  color: line.includes('[OK]') ? '#ffcc33'
                    : line.startsWith(OS_NAME) ? '#ee2222'
                    : '#aaaaaa',
                }}
              >
                {line}
              </motion.div>
            ))}
            {booting && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ color: '#ee2222', fontSize: 20 }}
              >█</motion.span>
            )}
          </div>

          {/* Progress */}
          <div className="relative z-10 mt-6">
            <div className="flex justify-between mb-1">
              <span style={{ color: '#aaaaaa', fontSize: 16 }}>Loading {OS_NAME}</span>
              <span style={{ color: '#ffcc33', fontSize: 16 }}>{progress}%</span>
            </div>
            <div style={{ background: '#1a0f14', border: '1px solid #ee2222', padding: 2 }}>
              <motion.div
                style={{ height: 12, background: '#ee2222' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
