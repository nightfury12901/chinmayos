'use client';
import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';

interface PhaserWrapperProps {
  config: Phaser.Types.Core.GameConfig;
  onDestroy?: () => void;
}

export function PhaserWrapper({ config, onDestroy }: PhaserWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let game: Phaser.Game | null = null;
    let isDestroyed = false;

    import('phaser').then((PhaserModule) => {
      if (isDestroyed) return;
      
      const PhaserLib = PhaserModule.default ?? PhaserModule;
      game = new PhaserLib.Game({
        ...config,
        parent: containerRef.current!,
      });
      gameRef.current = game;
    });

    return () => {
      isDestroyed = true;
      if (game) {
        game.destroy(true);
      }
      onDestroy?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#000' }}
    />
  );
}
