'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXPStore } from '@/store/xpStore';
import { useCoinStore } from '@/store/coinStore';

interface EggData {
  id: string;
  emoji: string;
  label: string;
  message: string;
  xp: number;
  coins: number;
  style: React.CSSProperties;
}

const EGGS: EggData[] = [
  {
    id: 'egg1',
    emoji: '🎲',
    label: 'LUCKY FIND',
    message: '+50 XP and +10 coins for having explorer instincts.',
    xp: 50, coins: 10,
    style: { top: '38%', right: '6%' },
  },
  {
    id: 'egg2',
    emoji: '💾',
    label: 'ANCIENT RELIC',
    message: 'You found a floppy disk. It still has data on it.',
    xp: 75, coins: 15,
    style: { top: '62%', left: '30%' },
  },
  {
    id: 'egg3',
    emoji: '🔮',
    label: 'VOID CRYSTAL',
    message: 'The void rewards those who search.',
    xp: 100, coins: 25,
    style: { top: '25%', left: '55%' },
  },
];

export function EasterEggs() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<EggData | null>(null);
  const { addXP } = useXPStore();
  const { addCoins } = useCoinStore();

  const handleFind = (egg: EggData) => {
    if (found.has(egg.id)) return;
    setFound((prev) => new Set([...prev, egg.id]));
    addXP(egg.xp, `Easter egg: ${egg.label}`);
    addCoins(egg.coins, `Easter egg: ${egg.label}`);
    setActive(egg);
  };

  return (
    <>
      {/* Hidden eggs scattered on desktop */}
      {EGGS.map((egg) => (
        <div
          key={egg.id}
          className="easter-egg absolute z-[8]"
          style={{
            ...egg.style,
            fontSize: 22,
            opacity: found.has(egg.id) ? 0.2 : 0.15,
            cursor: found.has(egg.id) ? 'default' : 'pointer',
            transition: 'opacity 0.3s',
            userSelect: 'none',
          }}
          onClick={() => handleFind(egg)}
          title={found.has(egg.id) ? 'Already found' : '...'}
        >
          {egg.emoji}
        </div>
      ))}

      {/* Discovery popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-[9990] flex flex-col gap-3 p-5"
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--color-bg)',
              border: '2px solid var(--color-accent)',
              boxShadow: '0 0 40px rgba(255,204,51,0.4)',
              minWidth: 300,
              fontFamily: "'VT323', monospace",
            }}
          >
            <div className="text-4xl text-center">{active.emoji}</div>
            <div className="text-center" style={{ color: 'var(--color-accent)', fontSize: 20, letterSpacing: '0.1em' }}>
              ★ {active.label} ★
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 18 }}>
              {active.message}
            </div>
            <div style={{ color: 'var(--color-primary)', fontSize: 17 }}>
              +{active.xp} XP · +{active.coins} coins
            </div>
            <button
              onClick={() => setActive(null)}
              className="w-full py-2 mt-1 transition-all"
              style={{
                border: '1px solid var(--color-accent)',
                color: 'var(--color-accent)',
                background: 'transparent',
                fontSize: 18,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-accent)'; }}
            >
              [ CLOSE ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
