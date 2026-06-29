import { useXPStore } from '@/store/xpStore';
import { useCoinStore } from '@/store/coinStore';
import { useAchievementStore } from '@/store/achievementStore';

export interface GameRewardOptions {
  score: number;
  xpPerScore?: number;
  baseXP?: number;
  coinsPerScore?: number;
  highScoreKey: string;
}

export function grantGameRewards(opts: GameRewardOptions) {
  const { score, xpPerScore = 1, baseXP = 50, coinsPerScore = 0.5, highScoreKey } = opts;

  const xp = Math.floor(baseXP + score * xpPerScore);
  const coins = Math.max(1, Math.floor(score * coinsPerScore));

  useXPStore.getState().addXP(xp, `Game score: ${score}`);
  useCoinStore.getState().addCoins(coins, `Game score: ${score}`);

  // High score check
  const prevHighScore = parseInt(localStorage.getItem(highScoreKey) ?? '0', 10);
  const isHighScore = score > prevHighScore;
  if (isHighScore) {
    localStorage.setItem(highScoreKey, String(score));
    useAchievementStore.getState().unlock('high_scorer');
  }

  return { xp, coins, isHighScore };
}

export function getHighScore(key: string): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(key) ?? '0', 10);
}
