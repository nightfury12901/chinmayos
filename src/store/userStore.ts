import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types/user.types';
import { v4 as uuidv4 } from 'uuid';

interface UserStore {
  profile: UserProfile | null;
  setupProfile: (username: string, avatar: string) => void;
  updateLastLogin: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,

      setupProfile: (username, avatar) => {
        set({
          profile: {
            id: uuidv4(),
            username,
            avatar,
            createdAt: Date.now(),
            lastLoginAt: Date.now(),
            isSetupComplete: true,
          },
        });
      },

      updateLastLogin: () => {
        set((state) =>
          state.profile
            ? { profile: { ...state.profile, lastLoginAt: Date.now() } }
            : {}
        );
      },
    }),
    { name: 'chinmayos-user' }
  )
);
