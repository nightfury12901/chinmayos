import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CoinTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
}

interface CoinStore {
  balance: number;
  transactions: CoinTransaction[];
  addCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => boolean;
}

import { v4 as uuidv4 } from 'uuid';

export const useCoinStore = create<CoinStore>()(
  persist(
    (set, get) => ({
      balance: 0,
      transactions: [],

      addCoins: (amount, reason) => {
        const tx: CoinTransaction = { id: uuidv4(), amount, reason, timestamp: Date.now() };
        set((state) => ({
          balance: state.balance + amount,
          transactions: [...state.transactions.slice(-49), tx],
        }));
      },

      spendCoins: (amount, reason) => {
        if (get().balance < amount) return false;
        const tx: CoinTransaction = { id: uuidv4(), amount: -amount, reason, timestamp: Date.now() };
        set((state) => ({
          balance: state.balance - amount,
          transactions: [...state.transactions.slice(-49), tx],
        }));
        return true;
      },
    }),
    { name: 'chinmayos-coins' }
  )
);
