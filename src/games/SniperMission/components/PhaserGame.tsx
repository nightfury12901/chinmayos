'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import prevents Phaser from loading on the server, which crashes due to window/document missing
const PhaserGameNoSSR = dynamic(() => import('./PhaserGameInner'), {
  ssr: false,
});

interface PhaserGameProps {
  level: number;
  onLevelComplete: () => void;
  onScore: (points: number) => void;
  onDamage: (dmg: number) => void;
}

export function PhaserGame(props: PhaserGameProps) {
  return <PhaserGameNoSSR {...props} />;
}
