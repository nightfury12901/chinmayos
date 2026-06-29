'use client';
import { useAchievementStore, ACHIEVEMENTS } from '@/store/achievementStore';
import { useXPStore } from '@/store/xpStore';
import { useCoinStore } from '@/store/coinStore';

export function useAchievements() {
  const { unlockedIds, pendingToast, unlock: _unlock, clearToast, isUnlocked } = useAchievementStore();
  const { addXP } = useXPStore();
  const { addCoins } = useCoinStore();

  const unlock = (id: string) => {
    const achievement = _unlock(id);
    if (achievement) {
      addXP(achievement.xpReward, `Achievement: ${achievement.name}`);
      addCoins(achievement.coinReward, `Achievement: ${achievement.name}`);
    }
    return achievement;
  };

  return {
    all: ACHIEVEMENTS,
    unlockedIds,
    pendingToast,
    unlock,
    clearToast,
    isUnlocked,
  };
}
