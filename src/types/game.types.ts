export interface GameConfig {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  coinRewardPerScore: number;
  highScoreKey: string;
}

export interface GameReward {
  xp: number;
  coins: number;
  score: number;
  isHighScore: boolean;
}

export interface GameSession {
  gameId: string;
  startedAt: number;
  endedAt?: number;
  score: number;
  reward?: GameReward;
}
