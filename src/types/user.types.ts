export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  unlockedAt?: number;
}

export interface XPEvent {
  id: string;
  reason: string;
  amount: number;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string; // emoji or URL
  createdAt: number;
  lastLoginAt: number;
  isSetupComplete: boolean;
}
