'use client';

export function NotificationsWidget() {
  return (
    <div
      className="absolute z-10 select-none flex flex-col"
      style={{
        top: '60px',
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
        <span>NOTIFICATIONS</span>
        <span style={{ color: '#00ff00' }}>_ □ X</span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        
        <div className="flex gap-3">
          <span style={{ fontSize: '16px', color: '#ffcc00' }}>⭐</span>
          <div className="flex flex-col flex-1">
            <span style={{ color: '#ff2a7a', fontWeight: 'bold' }}>ACHIEVEMENT UNLOCKED!</span>
            <span style={{ color: '#00ff00' }}>First Steps</span>
            <span style={{ color: '#00aa00' }}>+50 XP</span>
          </div>
          <span style={{ color: '#666' }}>[14:25]</span>
        </div>

        <div className="flex gap-3">
          <span style={{ fontSize: '16px', color: '#ffcc00' }}>🎁</span>
          <div className="flex flex-col flex-1">
            <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>DAILY REWARD CLAIMED!</span>
            <span style={{ color: '#00aa00' }}>100 Coins Added</span>
          </div>
          <span style={{ color: '#666' }}>[14:20]</span>
        </div>

        <div className="flex gap-3">
          <span style={{ fontSize: '16px', color: '#ff2a7a' }}>🎯</span>
          <div className="flex flex-col flex-1">
            <span style={{ color: '#ff2a7a', fontWeight: 'bold' }}>NEW MISSION AVAILABLE</span>
            <span style={{ color: '#00ff00' }}>Play a game</span>
            <span style={{ color: '#00aa00' }}>Reward: 200 XP, 150 Coins</span>
          </div>
          <span style={{ color: '#666' }}>[14:15]</span>
        </div>

      </div>
    </div>
  );
}
