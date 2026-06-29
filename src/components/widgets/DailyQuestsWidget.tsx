'use client';

export function DailyQuestsWidget() {
  return (
    <div
      className="absolute z-10 select-none flex flex-col"
      style={{
        top: '360px',
        right: '24px',
        width: '320px',
        background: 'rgba(10, 6, 8, 0.85)',
        border: '1px solid #1a2f26',
        color: '#ff2a7a',
        fontFamily: 'monospace, var(--font-family)',
        fontSize: '12px',
        boxShadow: '0 0 10px rgba(255, 42, 122, 0.1)',
      }}
    >
      <div className="flex justify-between items-center px-2 py-1" style={{ borderBottom: '1px solid #1a2f26' }}>
        <span>DAILY QUESTS</span>
        <span style={{ color: '#00ff00' }}>_ □ X</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2" style={{ color: '#00ff00' }}>
            <span>☑</span> Open Terminal
          </span>
          <span style={{ color: '#00aa00' }}>+50 XP</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2" style={{ color: '#666' }}>
            <span>☐</span> Play Flappy.exe
          </span>
          <span style={{ color: '#00aa00' }}>+100 XP</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2" style={{ color: '#666' }}>
            <span>☐</span> Complete Sniper Mission
          </span>
          <span style={{ color: '#00aa00' }}>+150 XP</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2" style={{ color: '#666' }}>
            <span>☐</span> Find Secret Folder
          </span>
          <span style={{ color: '#00aa00' }}>+200 XP</span>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div style={{ color: '#ff2a7a', fontSize: '10px' }}>DAILY BONUS: 1/4 COMPLETED</div>
          <div className="flex gap-1">
            <div style={{ flex: 1, height: '8px', background: '#ff2a7a' }}></div>
            <div style={{ flex: 1, height: '8px', background: '#330a1a' }}></div>
            <div style={{ flex: 1, height: '8px', background: '#330a1a' }}></div>
            <div style={{ flex: 1, height: '8px', background: '#330a1a' }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}
