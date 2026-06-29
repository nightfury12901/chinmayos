'use client';

export function SystemStatusWidget() {
  const bars = (percent: number) => {
    const totalBars = 20;
    const filledBars = Math.round((percent / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return (
      <span style={{ color: '#00ff00' }}>
        {'█'.repeat(filledBars)}
        <span style={{ color: '#1a2f26' }}>{'█'.repeat(emptyBars)}</span>
      </span>
    );
  };

  return (
    <div
      className="absolute z-10 select-none flex flex-col"
      style={{
        top: '60px',
        left: '280px',
        width: '320px',
        background: 'rgba(10, 6, 8, 0.85)',
        border: '1px solid #1a2f26',
        color: '#00ff00',
        fontFamily: 'monospace, var(--font-family)',
        fontSize: '12px',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)',
      }}
    >
      <div className="flex justify-between items-center px-2 py-1" style={{ borderBottom: '1px solid #1a2f26' }}>
        <span>SYSTEM STATUS.exe</span>
        <span>_ □ X</span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="w-24">CPU Usage</span>
          <span>[  12% ]</span>
          <span>{bars(12)}</span>
        </div>
        <div className="flex justify-between">
          <span className="w-24">RAM Usage</span>
          <span>[  28% ]</span>
          <span>{bars(28)}</span>
        </div>
        <div className="flex justify-between">
          <span className="w-24">SYS Temp</span>
          <span>[  42°C ]</span>
          <span>{bars(42)}</span>
        </div>
        <div className="flex justify-between">
          <span className="w-24">PING</span>
          <span>[  24ms ]</span>
          <span>{bars(24)}</span>
        </div>
        
        <div className="mt-4 text-center" style={{ color: '#00aa00' }}>
          ALL SYSTEMS NOMINAL
        </div>
      </div>
    </div>
  );
}
