import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Achievement } from '@/types/user.types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_login',
    name: 'Welcome to ChinmayOS',
    description: 'Log in for the first time',
    icon: '🎉',
    xpReward: 100,
    coinReward: 50,
  },
  {
    id: 'first_app',
    name: 'App Explorer',
    description: 'Open your first app',
    icon: '🚀',
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'first_game',
    name: 'Player One',
    description: 'Play your first game',
    icon: '🎮',
    xpReward: 200,
    coinReward: 100,
  },
  {
    id: 'terminal_explorer',
    name: 'Terminal Explorer',
    description: 'Use the terminal for the first time',
    icon: '💻',
    xpReward: 150,
    coinReward: 75,
  },
  {
    id: 'os_explorer',
    name: 'OS Explorer',
    description: 'Open 5 different apps',
    icon: '🌟',
    xpReward: 300,
    coinReward: 150,
  },
  {
    id: 'file_creator',
    name: 'File Creator',
    description: 'Create your first file',
    icon: '📄',
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'note_taker',
    name: 'Note Taker',
    description: 'Write your first note',
    icon: '📝',
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Set a high score in any game',
    icon: '🏆',
    xpReward: 250,
    coinReward: 125,
  },
];

interface AchievementStore {
  unlockedIds: string[];
  pendingToast: Achievement | null;
  unlock: (id: string) => Achievement | null;
  clearToast: () => void;
  isUnlocked: (id: string) => boolean;
  getAll: () => Achievement[];
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      pendingToast: null,

      unlock: (id) => {
        if (get().isUnlocked(id)) return null;
        const achievement = ACHIEVEMENTS.find((a) => a.id === id);
        if (!achievement) return null;
        set((state) => ({
          unlockedIds: [...state.unlockedIds, id],
          pendingToast: { ...achievement, unlockedAt: Date.now() },
        }));
        return achievement;
      },

      clearToast: () => set({ pendingToast: null }),

      isUnlocked: (id) => get().unlockedIds.includes(id),

      getAll: () =>
        ACHIEVEMENTS.map((a) => ({
          ...a,
          unlockedAt: get().unlockedIds.includes(a.id) ? Date.now() : undefined,
        })),
    }),
    { name: 'chinmayos-achievements' }
  )
);
