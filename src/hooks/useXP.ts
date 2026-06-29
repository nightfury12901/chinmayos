'use client';
import { useXPStore } from '@/store/xpStore';

export function useXP() {
  const { totalXP, level, history, addXP, getLevelProgress } = useXPStore();
  return { totalXP, level, history, addXP, getLevelProgress };
}
