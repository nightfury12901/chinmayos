'use client';

interface MainMenuScreenProps {
  onStart: () => void;
  onArmory: () => void;
}

export function MainMenuScreen({ onStart, onArmory }: MainMenuScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c] text-[#00ee00] select-none p-8">
      {/* Background City Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(transparent, #ee2222), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect width=\'20\' height=\'60\' x=\'10\' y=\'40\' fill=\'%23000\'/%3E%3Crect width=\'30\' height=\'80\' x=\'40\' y=\'20\' fill=\'%23000\'/%3E%3Crect width=\'15\' height=\'50\' x=\'80\' y=\'50\' fill=\'%23000\'/%3E%3C/svg%3E")',
        backgroundSize: '100px 100%',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'bottom'
      }} />

      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col justify-center gap-12">
        {/* Title */}
        <div>
          <div className="text-xl mb-2 text-[#00aa00]">// WELCOME, SNIPER</div>
          <h1 className="text-7xl font-bold tracking-widest text-[#dddddd]" style={{ textShadow: '2px 2px 0 #ee2222' }}>
            SNIPER.EXE <span className="text-xl text-[#ee2222]">v1.0.0</span>
          </h1>
          <div className="text-lg text-[#00aa00] mt-2 tracking-widest">ELITE OPERATIVE SYSTEM</div>
        </div>

        {/* Content Columns */}
        <div className="flex gap-8">
          {/* Nav Links */}
          <div className="flex flex-col gap-2 w-64">
            <button className="text-left px-4 py-3 bg-[rgba(238,34,34,0.15)] text-[#ee2222] border border-[#ee2222] font-bold flex items-center gap-3">
              <span>➔</span> QUICK MISSION
            </button>
            <button className="text-left px-4 py-3 hover:bg-[#111] hover:text-[#00ff00] text-[#888] border border-transparent transition-all flex items-center gap-3">
              <span>⌖</span> CAMPAIGN
            </button>
            <button className="text-left px-4 py-3 hover:bg-[#111] hover:text-[#00ff00] text-[#888] border border-transparent transition-all flex items-center gap-3">
              <span>📋</span> CONTRACTS
            </button>
            <button onClick={onArmory} className="text-left px-4 py-3 hover:bg-[#111] hover:text-[#00ff00] text-[#888] border border-transparent transition-all flex items-center gap-3">
              <span>🔫</span> ARMORY
            </button>
            <button className="text-left px-4 py-3 hover:bg-[#111] hover:text-[#00ff00] text-[#888] border border-transparent transition-all flex items-center gap-3">
              <span>⚙️</span> SETTINGS
            </button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('sniper-mission-exit'))} className="text-left px-4 py-3 hover:bg-[#111] hover:text-[#ff0000] text-[#888] border border-transparent transition-all flex items-center gap-3 mt-8">
              <span>⏻</span> EXIT SYSTEM
            </button>
          </div>

          {/* Today's Contract */}
          <div className="flex-1 border border-[#1a2f26] bg-[rgba(10,10,12,0.8)] p-6 flex flex-col justify-between">
            <div>
              <div className="text-[#00aa00] mb-4">// TODAY'S CONTRACT</div>
              <div className="flex gap-6">
                <div className="w-32 h-32 bg-[#111] border border-[#ee2222] flex flex-col items-center justify-center relative">
                  <span className="text-6xl mb-1">❓</span>
                  <span className="text-[#ee2222] text-xs font-bold tracking-widest">CLASSIFIED</span>
                </div>
                <div className="flex flex-col gap-3 justify-center">
                  <div><span className="text-[#888]">TARGET:</span> <span className="text-[#ee2222] font-bold">UNKNOWN IDENTITY</span></div>
                  <div><span className="text-[#888]">LOCATION:</span> <span className="text-[#00ee00]">DOWNTOWN</span></div>
                  <div><span className="text-[#888]">DISTANCE:</span> <span className="text-[#00ee00]">350m</span></div>
                  <div><span className="text-[#888]">REWARD:</span> <span className="text-[#ffcc00] font-bold">$4,500</span></div>
                </div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="mt-8 w-full py-4 border border-[#00ee00] hover:bg-[#00ee00] hover:text-black text-[#00ee00] font-bold text-xl flex justify-between px-6 transition-all"
            >
              <span>ENTER MISSION</span>
              <span>&gt;_</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-[#1a2f26] pt-4 flex justify-between text-sm">
          <div><span className="text-[#888]">RANK:</span> ROOKIE SNIPER</div>
          <div><span className="text-[#888]">XP:</span> 1,250 / 5,000</div>
          <div><span className="text-[#888]">CASH:</span> <span className="text-[#ffcc00]">$12,430</span></div>
        </div>
      </div>
    </div>
  );
}
