'use client';
import { useCoinStore } from '@/store/coinStore';

export function useCoins() {
  const { balance, transactions, addCoins, spendCoins } = useCoinStore();
  return { balance, transactions, addCoins, spendCoins };
}
