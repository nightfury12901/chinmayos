'use client';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '@/store/windowStore';
import { TitleBar } from './TitleBar';

interface WindowFrameProps {
  windowId: string;
  children: React.ReactNode;
}

export function WindowFrame({ windowId, children }: WindowFrameProps) {
  const win = useWindowStore((s) => s.windows.find((w) => w.id === windowId));
  const { focusWindow, setWindowBounds, maximizeWindow } = useWindowStore();

  if (!win || win.status === 'minimized') return null;

  const isMaximized = win.status === 'maximized';
  const borderColor = win.isFocused ? '#00ff41' : '#003a0d';
  const shadow = win.isFocused
    ? '0 0 30px rgba(0,255,65,0.25), 0 0 0 1px #00ff41'
    : '0 0 12px rgba(0,0,0,0.8)';

  const windowStyle = {
    background: '#000800',
    border: `1px solid ${borderColor}`,
    boxShadow: shadow,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  };

  return (
    <AnimatePresence>
      <motion.div
        key={windowId}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          zIndex: win.zIndex,
          ...(isMaximized ? { top: 0, left: 0, right: 0, bottom: 48, width: '100vw', height: 'calc(100vh - 48px)' } : {}),
        }}
        onMouseDown={() => focusWindow(windowId)}
      >
        {isMaximized ? (
          <div style={{ ...windowStyle, borderRadius: 0 }}>
            <TitleBar windowId={windowId} />
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        ) : (
          <Rnd
            size={{ width: win.width, height: win.height }}
            position={{ x: win.x, y: win.y }}
            minWidth={win.minWidth}
            minHeight={win.minHeight}
            enableResizing={win.isResizable}
            dragHandleClassName="window-drag-handle"
            bounds="window"
            onDragStop={(_, d) => setWindowBounds(windowId, d.x, d.y, win.width, win.height)}
            onResizeStop={(_, __, ref, ___, pos) =>
              setWindowBounds(windowId, pos.x, pos.y, parseInt(ref.style.width), parseInt(ref.style.height))
            }
            style={{ zIndex: win.zIndex }}
          >
            <div style={windowStyle}>
              <TitleBar windowId={windowId} />
              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </Rnd>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
