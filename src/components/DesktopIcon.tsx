'use client';
import { motion } from 'framer-motion';
import { useWindowManager } from '@/hooks/useWindowManager';

interface DesktopIconProps {
  appId: string;
  icon: string;
  name: string;
}

export function DesktopIcon({ appId, icon, name }: DesktopIconProps) {
  const { launchApp } = useWindowManager();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => launchApp(appId)}
      className="flex flex-col items-center gap-1 select-none cursor-pointer group"
      style={{
        background: 'transparent',
        border: 'none',
        padding: '6px 10px',
        width: 72,
        fontFamily: "'VT323', monospace",
      }}
    >
      {/* Icon box */}
      <div
        className="flex items-center justify-center transition-all"
        style={{
          width: 44,
          height: 44,
          fontSize: 24,
          border: '1px solid rgba(238,34,34,0.3)',
          background: 'rgba(10,6,8,0.6)',
          imageRendering: 'pixelated',
        }}
      >
        {icon}
      </div>

      {/* Name */}
      <span
        className="text-center leading-tight transition-all"
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.8)',
          textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(238,34,34,0.3)',
          maxWidth: 68,
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {name.toUpperCase()}
      </span>
    </motion.button>
  );
}
