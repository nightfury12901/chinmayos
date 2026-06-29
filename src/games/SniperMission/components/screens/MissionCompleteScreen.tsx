'use client';

interface MissionCompleteScreenProps {
  onContinue: () => void;
  onRetry: () => void;
  timeTaken: number;
  reward: number;
  xp: number;
}

export function MissionCompleteScreen({ onContinue, onRetry, timeTaken, reward, xp }: MissionCompleteScreenProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c] text-[#00ee00] select-none p-8">
      <div className="relative z-10 w-full max-w-2xl border border-[#1a2f26] bg-[rgba(10,10,12,0.9)] p-8 shadow-[0_0_50px_rgba(0,238,0,0.1)]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#1a2f26] pb-4 mb-8">
          <div className="text-xl">// MISSION COMPLETE</div>
          <button className="text-[#888]">_ □ X</button>
        </div>

        {/* Main Status */}
        <div className="flex items-center gap-8 border border-[#1a2f26] p-6 mb-8 bg-[rgba(0,238,0,0.05)]">
          <div className="text-6xl text-[#00ee00]" style={{ textShadow: '0 0 10px #00ee00' }}>
            💀
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">TARGET ELIMINATED</h2>
            <div className="text-[#ee2222]">THE BROKER</div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="flex justify-between gap-8"><span className="text-[#888]">TIME TAKEN</span> <span className="text-[#00ee00]">{formatTime(timeTaken)}</span></div>
            <div className="flex justify-between gap-8"><span className="text-[#888]">DISTANCE</span> <span className="text-[#00ee00]">350m</span></div>
            <div className="flex justify-between gap-8"><span className="text-[#888]">ACCURACY</span> <span className="text-[#00ee00]">96%</span></div>
          </div>
        </div>

        {/* Rewards */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-[#888] mb-2">REWARD</div>
            <div className="text-5xl font-bold text-[#00ee00]">${reward.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[#888] mb-2">XP</div>
            <div className="text-5xl font-bold text-[#bb44ff]">+{xp.toLocaleString()}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-6">
          <button 
            onClick={onRetry}
            className="w-48 flex items-center justify-center gap-2 py-4 border border-[#1a2f26] text-[#888] hover:bg-[#111] hover:text-[#00ee00] transition-colors"
          >
            <span>↻</span> RETRY
          </button>
          <button 
            onClick={onContinue}
            className="flex-1 flex items-center justify-between px-8 py-4 border border-[#00ee00] text-[#00ee00] hover:bg-[#00ee00] hover:text-black transition-colors font-bold text-xl"
          >
            <span>CONTINUE</span>
            <span>&gt;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
