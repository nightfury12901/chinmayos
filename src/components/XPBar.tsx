'use client';
import { useXPStore } from '@/store/xpStore';

export function XPBar() {
  const { level, getLevelProgress } = useXPStore();
  const { current, needed, percent } = getLevelProgress();

  return (
    <div className="flex items-center gap-2 px-1 select-none" title={`${current}/${needed} XP`}>
      <span className="text-[10px]" style={{ color: '#00aa2a', fontFamily: 'monospace' }}>
        LV{level}
      </span>
      <div
        className="w-16 h-1.5 relative"
        style={{ background: '#001100', border: '1px solid #003a0d' }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${percent}%`, background: '#00ff41', boxShadow: '0 0 4px rgba(0,255,65,0.8)' }}
        />
      </div>
    </div>
  );
}
