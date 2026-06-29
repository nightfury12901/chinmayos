'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAchievements } from '@/hooks/useAchievements';

export function AchievementToast() {
  const { pendingToast, clearToast } = useAchievements();

  useEffect(() => {
    if (!pendingToast) return;
    const t = setTimeout(clearToast, 4500);
    return () => clearTimeout(t);
  }, [pendingToast, clearToast]);

  return (
    <div className="fixed top-10 right-4 z-[99999] pointer-events-none">
      <AnimatePresence>
        {pendingToast && (
          <motion.div
            key={pendingToast.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.18 }}
            style={{
              background: 'var(--color-bg)',
              border: '2px solid var(--color-accent)',
              boxShadow: '0 0 24px rgba(255,204,51,0.35)',
              minWidth: 280,
              fontFamily: "'VT323', monospace",
              padding: '12px 16px',
            }}
          >
            <div style={{ color: 'var(--color-text-dim)', fontSize: 14, letterSpacing: '0.1em', marginBottom: 2 }}>
              ★ ACHIEVEMENT UNLOCKED
            </div>
            <div style={{ color: 'var(--color-accent)', fontSize: 20, letterSpacing: '0.05em', marginBottom: 2 }}>
              {pendingToast.name}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 17, marginBottom: 6 }}>
              {pendingToast.description}
            </div>
            <div style={{ color: 'var(--color-primary)', fontSize: 16 }}>
              +{pendingToast.xpReward} XP · +{pendingToast.coinReward} COINS
            </div>
            <div style={{ height: 2, background: 'var(--color-accent)', marginTop: 8 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
