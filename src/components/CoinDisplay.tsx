'use client';
import { useCoinStore } from '@/store/coinStore';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function CoinDisplay() {
  const balance = useCoinStore((s) => s.balance);
  const prevBalance = useRef(balance);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (balance !== prevBalance.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
      prevBalance.current = balance;
    }
  }, [balance]);

  return (
    <div className="flex items-center gap-1 px-1 select-none">
      <motion.span
        animate={flash ? { color: ['#aaffaa', '#00aa2a'] } : {}}
        className="text-[10px]"
        style={{ color: '#00aa2a', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}
      >
        ${balance.toLocaleString()}
      </motion.span>
    </div>
  );
}
