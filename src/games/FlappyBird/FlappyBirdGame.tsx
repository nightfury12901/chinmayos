'use client';
import dynamic from 'next/dynamic';
import { getHighScore } from '@/games/GameRewardBridge';
import { useState } from 'react';

const PhaserWrapper = dynamic(
  () => import('@/games/PhaserWrapper').then((m) => m.PhaserWrapper),
  { ssr: false }
);

export default function FlappyBirdGame() {
  const [config] = useState(() => ({
    type: 0, // AUTO
    width: 480,
    height: 640,
    backgroundColor: '#1a1a3e',
    scene: [],
    physics: { default: 'arcade', arcade: { debug: false } },
  }));

  const [phaserConfig] = useState<import('phaser').Types.Core.GameConfig>(() => {
    if (typeof window === 'undefined') return config as never;
    const { MainScene } = require('./scenes/MainScene');
    return {
      ...config,
      scene: [MainScene],
    } as never;
  });

  return (
    <div className="w-full h-full flex flex-col items-center" style={{ background: '#1a1a3e' }}>
      <PhaserWrapper config={phaserConfig} />
    </div>
  );
}
