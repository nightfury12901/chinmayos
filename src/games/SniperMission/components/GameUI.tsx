'use client';
import { useState, useEffect } from 'react';
import { GameState } from '../SniperMissionGame';

interface GameUIProps {
  gameState: GameState;
  score: number;
  health: number;
  level: number;
  timeTaken: number;
  onStart: () => void;
}

export function GameUI({ gameState, score, health, level, timeTaken, onStart }: GameUIProps) {
  const [isScoped, setIsScoped] = useState(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) setIsScoped(true);
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) setIsScoped(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Prevent context menu
    const handleContext = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', handleContext);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContext);
    };
  }, []);

  if (gameState !== 'playing' && gameState !== 'gameover') {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 select-none font-monospace" style={{ fontFamily: 'monospace, var(--font-family)' }}>
      {/* Top section: Mission objective */}
      <div className="flex justify-between items-start w-full text-[#00ee00]">
        <div className="bg-[rgba(10,10,12,0.8)] border border-[#1a2f26] px-4 py-2 flex items-center gap-4">
          <span>// MISSION: ELIMINATE THE BROKER</span>
        </div>
        <div className="bg-[rgba(10,10,12,0.8)] border border-[#1a2f26] px-4 py-2">
          01:24
        </div>
      </div>

      {/* Scope Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isScoped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,1) 100%)',
        }}
      >
        {isScoped && (
          <>
            {/* Scope Crosshairs */}
            <div className="absolute w-[1px] h-screen bg-[rgba(255,0,0,0.5)]"></div>
            <div className="absolute h-[1px] w-screen bg-[rgba(255,0,0,0.5)]"></div>
            
            {/* Center Dot */}
            <div className="absolute w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_red]"></div>

            {/* Scope UI Details */}
            <div className="absolute right-1/4 top-1/3 text-[#00ee00] flex flex-col gap-4 text-sm">
              <div>
                <div className="text-[#888]">WIND</div>
                <div>2.4 m/s ➔</div>
              </div>
              <div>
                <div className="text-[#888]">DISTANCE</div>
                <div>350m</div>
              </div>
            </div>

            <div className="absolute right-1/4 bottom-1/3 text-[#00ee00] flex flex-col gap-2 text-sm">
              <div className="text-[#888]">ZOOM</div>
              <div>x6.0</div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="w-4 h-2 bg-[#1a2f26]"></div>
                <div className="w-4 h-2 bg-[#1a2f26]"></div>
                <div className="w-4 h-2 bg-[#00ee00]"></div>
                <div className="w-4 h-2 bg-[#00ee00]"></div>
                <div className="w-4 h-2 bg-[#00ee00]"></div>
              </div>
            </div>

            {/* Bottom Left Scope UI */}
            <div className="absolute left-1/4 bottom-1/4 flex gap-1 items-end">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-3 h-8 bg-[#ffcc00] clip-bullet"></div>
              ))}
              <span className="text-[#ffcc00] ml-2 font-bold">5/10</span>
            </div>
            
            {/* Heartbeat / Stable line */}
            <div className="absolute right-1/4 bottom-1/4 flex flex-col items-end text-[#00ee00]">
              <div className="w-32 h-8 border-b border-[#00ee00] relative">
                <div className="absolute top-1/2 left-1/2 w-4 h-4 border-t border-l border-[#00ee00] transform -rotate-45"></div>
              </div>
              <div className="mt-1">STABLE</div>
            </div>
          </>
        )}
      </div>

      {!isScoped && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex justify-between items-end w-full relative z-20">
        {/* Health */}
        <div className="bg-[rgba(10,10,12,0.8)] border border-[#1a2f26] p-4 flex items-center gap-4 text-[#00ee00]">
          <div className="text-2xl text-[#ee2222]">♥</div>
          <div className="text-3xl font-bold">{health}</div>
        </div>
        
        {/* Inventory */}
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-[rgba(10,10,12,0.8)] border border-[#1a2f26] flex items-center justify-center text-[#888] relative">
            <span>🩹</span>
            <span className="absolute bottom-1 right-1 text-[10px]">2</span>
          </div>
          <div className="w-12 h-12 bg-[rgba(10,10,12,0.8)] border border-[#1a2f26] flex items-center justify-center text-[#888] relative">
            <span>💣</span>
            <span className="absolute bottom-1 right-1 text-[10px]">1</span>
          </div>
        </div>

        {/* Ammo */}
        <div className="bg-[rgba(10,10,12,0.8)] border border-[#1a2f26] p-4 flex items-end gap-2">
          <div className="text-3xl font-bold text-[#ffcc00]">5/10</div>
          <div className="flex gap-1 pb-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-2 h-4 bg-[#ffcc00]"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
