import { SaveData } from '../../types/SaveData';
import { CONSTANTS } from '../../constants';

const SAVE_KEY = 'sniper_exe_save';

const DEFAULT_SAVE: SaveData = {
  credits: 0,
  xp: 0,
  equippedWeapon: 'M24',
  unlockedWeapons: ['M24'],
  unlockedMaps: ['NeonDistrict'],
  missionsCompleted: 0,
  totalKills: 0,
  bestScore: 0,
};

export class SaveSystem {
  static load(): SaveData {
    if (typeof window === 'undefined') return DEFAULT_SAVE;
    
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all fields exist
        return { ...DEFAULT_SAVE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
    }
    return DEFAULT_SAVE;
  }

  static save(data: SaveData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  static reset(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to reset save data:', e);
    }
  }
}
