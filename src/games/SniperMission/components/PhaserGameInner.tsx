import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from '../phaser/scenes/BootScene';
import { MenuScene } from '../phaser/scenes/MenuScene';
import { ArmoryScene } from '../phaser/scenes/ArmoryScene';
import { MapSelectScene } from '../phaser/scenes/MapSelectScene';
import { BriefingScene } from '../phaser/scenes/BriefingScene';
import { GameScene } from '../phaser/scenes/GameScene';
import { EndScene } from '../phaser/scenes/EndScene';

export interface PhaserGameInnerProps {
  level: number;
  onLevelComplete: () => void;
  onScore: (points: number) => void;
  onDamage: (amount: number) => void;
}

export default function PhaserGameInner({ level, onLevelComplete, onScore, onDamage }: PhaserGameInnerProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  
  // Use refs to keep callbacks fresh without triggering useEffect re-runs
  const callbacksRef = useRef({ onLevelComplete, onScore, onDamage, level });
  useEffect(() => {
    callbacksRef.current = { onLevelComplete, onScore, onDamage, level };
  }, [level, onLevelComplete, onScore, onDamage]);

  useEffect(() => {
    if (!gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        parent: 'phaser-container',
        backgroundColor: '#0a0a0f',
        audio: {
          noAudio: true
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        scene: [BootScene, MenuScene, MapSelectScene, ArmoryScene, BriefingScene, GameScene, EndScene],
      };

      gameRef.current = new Phaser.Game(config);
      
      // We pass a proxy to the scene so it always uses the latest callbacks
      const scene = gameRef.current.scene.keys.GameScene as GameScene;
      if (scene) {
        scene.setCallbacks({
          onLevelComplete: () => callbacksRef.current.onLevelComplete(),
          onScore: (points: number) => callbacksRef.current.onScore(points),
          onDamage: (amount: number) => callbacksRef.current.onDamage(amount),
          get level() { return callbacksRef.current.level; }
        });
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []); // Empty dependency array: only run ONCE on mount

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    window.dispatchEvent(new Event('sniper-mission-exit'));
  };

  return (
    <div className="relative w-full h-full">
      <div id="phaser-container" className="w-full h-full" />
      {/* Fullscreen Exit Button */}
      <button 
        onClick={handleExit}
        className="absolute top-4 right-4 z-[9999] bg-black/50 hover:bg-red-500/80 text-white p-2 rounded transition-colors border border-gray-600/50"
        title="Exit Fullscreen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
