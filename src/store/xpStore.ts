import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { XPEvent } from '@/types/user.types';
import { v4 as uuidv4 } from 'uuid';

const XP_PER_LEVEL = 500;

function calcLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

interface XPStore {
  totalXP: number;
  level: number;
  history: XPEvent[];
  addXP: (amount: number, reason: string) => void;
  getLevelProgress: () => { current: number; needed: number; percent: number };
}

export const useXPStore = create<XPStore>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      level: 1,
      history: [],

      addXP: (amount, reason) => {
        const event: XPEvent = {
          id: uuidv4(),
          reason,
          amount,
          timestamp: Date.now(),
        };
        set((state) => {
          const newXP = state.totalXP + amount;
          return {
            totalXP: newXP,
            level: calcLevel(newXP),
            history: [...state.history.slice(-49), event],
          };
        });
      },

      getLevelProgress: () => {
        const { totalXP } = get();
        const level = calcLevel(totalXP);
        const levelStart = (level - 1) * XP_PER_LEVEL;
        const current = totalXP - levelStart;
        const needed = XP_PER_LEVEL;
        return { current, needed, percent: Math.min((current / needed) * 100, 100) };
      },
    }),
    { name: 'chinmayos-xp' }
  )
);
