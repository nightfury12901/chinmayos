'use client';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';

export function TopBar() {
  const profile = useUserStore((s) => s.profile);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[800] flex items-center justify-between px-4 select-none"
      style={{
        height: 36,
        background: 'rgba(10, 6, 8, 0.9)',
        borderBottom: '2px solid #1a2f26',
        color: '#00ff00',
        fontFamily: 'monospace, var(--font-family)',
        fontSize: '12px',
        letterSpacing: '0.05em',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)',
      }}
    >
      <div className="flex gap-8 items-center h-full">
        <span style={{ color: '#00ff00' }}>NEXOS v1.0.0</span>
        <span style={{ color: '#00ff00' }}>|</span>
        <span style={{ color: '#00ff00' }}>WELCOME BACK, {profile?.name?.toUpperCase() || 'USER'}</span>
      </div>

      <div className="flex items-center h-full text-center" style={{ color: '#00ff00', textShadow: '0 0 5px #00ff00' }}>
        ★ SYSTEM ONLINE ★
      </div>

      <div className="flex gap-6 items-center h-full">
        <span style={{ color: '#00ff00' }}>USER: <span style={{ color: '#ee2222' }}>{profile?.name?.toUpperCase() || 'USER'}</span></span>
        <span style={{ color: '#ff2afc' }}>XP: 1,240</span>
        <span style={{ color: '#ffcc00' }}>COINS: 530</span>
        <span className="flex items-center gap-2">
          <span>🔊</span>
          <span>{time}</span>
        </span>
      </div>
    </div>
  );
}
