'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { grantGameRewards } from '@/games/GameRewardBridge';
import { useWindowStore } from '@/store/windowStore';
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { ArmoryScreen } from './components/screens/ArmoryScreen';
import { MissionCompleteScreen } from './components/screens/MissionCompleteScreen';

const HIGH_SCORE_KEY = 'chinmayos-voidshooter-highscore';

import { PhaserGame } from './components/PhaserGame';

export type GameState = 'menu' | 'armory' | 'playing' | 'missionComplete' | 'gameover';

export default function SniperMissionGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [timeTaken, setTimeTaken] = useState(0);

  const startGame = () => {
    setScore(0);
    setHealth(100);
    setLevel(1);
    setTimeTaken(0);
    setGameState('playing');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeTaken(t => t + 1);
      }, 1000);
    }

    const handleExit = () => {
      const myWindow = useWindowStore.getState().windows.find(w => w.appId === 'sniper-mission');
      if (myWindow) {
        useWindowStore.getState().closeWindow(myWindow.id);
      }
    };
    window.addEventListener('sniper-mission-exit', handleExit);

    return () => {
      clearInterval(timer);
      window.removeEventListener('sniper-mission-exit', handleExit);
    };
  }, [gameState]);

  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      setGameState('gameover');
      document.exitPointerLock?.();
      
      // Grant OS Rewards
      grantGameRewards({
        score,
        baseXP: 50 + (level * 10),
        xpPerScore: 0.5,
        coinsPerScore: 0.2,
        highScoreKey: HIGH_SCORE_KEY,
      });
    }
  }, [health, gameState, score, level]);

  const handleLevelComplete = () => {
    setGameState('missionComplete');
    document.exitPointerLock?.();
    
    grantGameRewards({
        score: score + 1000,
        baseXP: 100 + (level * 50),
        xpPerScore: 0.5,
        coinsPerScore: 0.2,
        highScoreKey: HIGH_SCORE_KEY,
    });
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0c] overflow-hidden" style={{ fontFamily: 'monospace, var(--font-family)' }}>
      {gameState === 'playing' && (
        <PhaserGame
          level={level}
          onScore={(points) => setScore((s) => s + points)}
          onDamage={(dmg) => setHealth((h) => Math.max(0, h - dmg))}
          onLevelComplete={handleLevelComplete}
        />
      )}

      {gameState === 'menu' && (
        <MainMenuScreen 
          onStart={() => setGameState('playing')} 
          onArmory={() => setGameState('armory')} 
        />
      )}

      {gameState === 'armory' && (
        <ArmoryScreen 
          onBack={() => setGameState('menu')} 
        />
      )}

      {gameState === 'missionComplete' && (
        <MissionCompleteScreen 
          onContinue={() => {
            setLevel(l => l + 1);
            setHealth(100);
            setTimeTaken(0);
            setGameState('playing');
          }}
          onRetry={startGame}
          timeTaken={timeTaken}
          reward={4500 + level * 500}
          xp={850 + level * 100}
        />
      )}

    </div>
  );
}
