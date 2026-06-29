'use client';
import { useWindowStore } from '@/store/windowStore';

interface TitleBarProps {
  windowId: string;
}

export function TitleBar({ windowId }: TitleBarProps) {
  const win = useWindowStore((s) => s.windows.find((w) => w.id === windowId));
  const { closeWindow, minimizeWindow, maximizeWindow } = useWindowStore();

  if (!win) return null;

  const focused = win.isFocused;

  return (
    <div
      className="window-drag-handle flex items-center justify-between px-2 shrink-0"
      style={{
        height: 32,
        background: focused ? '#150b10' : 'var(--color-bg)',
        borderBottom: `2px solid ${focused ? 'var(--color-primary)' : 'rgba(238,34,34,0.25)'}`,
        fontFamily: "'VT323', monospace",
      }}
      onDoubleClick={() => maximizeWindow(windowId)}
    >
      {/* Left: icon + title */}
      <div className="flex items-center gap-2 min-w-0">
        <span style={{ fontSize: 14 }}>{win.icon}</span>
        <span
          style={{
            fontSize: 17,
            color: focused ? 'var(--color-text)' : 'var(--color-text-dim)',
            letterSpacing: '0.06em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {win.title.toUpperCase()}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Minimize */}
        <button
          onClick={() => minimizeWindow(windowId)}
          title="Minimize"
          style={{
            width: 28, height: 28,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 18,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >_</button>

        {/* Maximize */}
        <button
          onClick={() => maximizeWindow(windowId)}
          title="Maximize"
          style={{
            width: 28, height: 28,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 18,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >□</button>

        {/* Close */}
        <button
          onClick={() => closeWindow(windowId)}
          title="Close"
          style={{
            width: 28, height: 28,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            fontSize: 18,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
        >✕</button>
      </div>
    </div>
  );
}
