'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { ACHIEVEMENTS } from '@/store/achievementStore';
import { useAchievements } from '@/hooks/useAchievements';
import { useXPStore } from '@/store/xpStore';
import { useCoinStore } from '@/store/coinStore';

type Tab = 'appearance' | 'achievements' | 'economy';

export default function SettingsApp() {
  const { theme, setTheme, allThemes } = useTheme();
  const { unlockedIds } = useAchievements();
  const { totalXP, level, getLevelProgress } = useXPStore();
  const { balance } = useCoinStore();
  const [activeTab, setActiveTab] = useState<Tab>('appearance');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'economy', label: 'Economy', icon: '🪙' },
  ];

  const progress = getLevelProgress();

  return (
    <div className="flex h-full" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      {/* Sidebar */}
      <div
        className="w-44 flex flex-col gap-1 p-3 shrink-0"
        style={{ background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="text-xs font-bold uppercase tracking-widest px-2 py-2 mb-1" style={{ color: 'var(--color-text-dim)' }}>
          Settings
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
            style={{
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Themes</h2>
            <div className="grid grid-cols-3 gap-4">
              {allThemes.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTheme(t.id)}
                  className="flex flex-col gap-3 p-4 rounded-2xl text-left transition-all"
                  style={{
                    background: t.colors.bg,
                    border: `2px solid ${theme === t.id ? t.colors.primary : t.colors.border}`,
                    boxShadow: theme === t.id ? `0 0 20px ${t.colors.primary}44` : 'none',
                  }}
                >
                  <div className="flex gap-1.5">
                    {[t.colors.primary, t.colors.accent, t.colors.bg].map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: t.colors.text }}>{t.name}</div>
                    {theme === t.id && (
                      <div className="text-[10px]" style={{ color: t.colors.accent }}>Active</div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              Achievements ({unlockedIds.length}/{ACHIEVEMENTS.length})
            </h2>
            <div className="space-y-2">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = unlockedIds.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-3 rounded-xl"
                    style={{
                      background: unlocked ? 'var(--color-surface)' : 'var(--color-bg-secondary)',
                      border: `1px solid ${unlocked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      opacity: unlocked ? 1 : 0.5,
                    }}
                  >
                    <span className="text-2xl">{unlocked ? a.icon : '🔒'}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{a.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{a.description}</div>
                    </div>
                    <div className="text-right text-xs" style={{ color: 'var(--color-accent)' }}>
                      <div>+{a.xpReward} XP</div>
                      <div>+{a.coinReward} 🪙</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'economy' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Economy</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Level', value: level, icon: '⭐', color: 'var(--color-primary)' },
                { label: 'Total XP', value: totalXP.toLocaleString(), icon: '✨', color: 'var(--color-accent)' },
                { label: 'Coins', value: balance.toLocaleString(), icon: '🪙', color: '#f5a623' },
                { label: 'Achievements', value: `${unlockedIds.length}/${ACHIEVEMENTS.length}`, icon: '🏆', color: 'var(--color-success)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                  <span className="text-3xl">{stat.icon}</span>
                  <div>
                    <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Level {level} Progress</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{progress.current}/{progress.needed} XP</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.percent}%`, background: 'var(--color-accent)' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
