'use client';
import { useWindowStore } from '@/store/windowStore';
import { useWindowManager } from '@/hooks/useWindowManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { APP_REGISTRY } from '@/core/apps/registry';
import { useUserStore } from '@/store/userStore';

export function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const { focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const { launchApp } = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const profile = useUserStore((s) => s.profile);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskbarItem = (winId: string, status: string, isFocused: boolean) => {
    if (status === 'minimized') {
      restoreWindow(winId);
    } else if (isFocused) {
      minimizeWindow(winId);
    } else {
      focusWindow(winId);
    }
  };

  const getAppIcon = (winId: string) => {
    const app = APP_REGISTRY.find(a => a.id === winId);
    return app?.icon || '🖥️';
  };

  return (
    <>
      {/* START MENU */}
      <AnimatePresence>
        {startOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.12 }}
            className="fixed bottom-12 left-0 z-[900] flex flex-col select-none"
            style={{
              background: 'rgba(10, 6, 8, 0.95)',
              border: '1px solid #1a2f26',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
              fontFamily: 'monospace, var(--font-family)',
              width: '460px',
              color: '#00ff00',
              fontSize: '12px'
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-2 py-1" style={{ borderBottom: '1px solid #1a2f26' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>NEXOS START</span>
              <span>_ □ X</span>
            </div>

            <div className="flex p-2 gap-2 h-[260px]">
              {/* Left Column - Navigation */}
              <div className="w-[140px] flex flex-col gap-1 border-r border-[#1a2f26] pr-2">
                {['MY PROFILE', 'INVENTORY', 'LEADERBOARD', 'MAP', 'FRIENDS', 'SHOP'].map(item => (
                  <button key={item} className="text-left px-2 py-1 hover:bg-[#1a2f26] hover:text-[#00ff00] transition-colors flex items-center gap-2">
                    <span className="text-[#666]">►</span> {item}
                  </button>
                ))}
                <div className="mt-auto">
                  <button className="text-left px-2 py-1 hover:bg-[#ff2a7a] hover:text-white transition-colors w-full text-[#ff2a7a] flex items-center gap-2">
                    <span>⏻</span> LOGOUT
                  </button>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="flex-1 pl-2 flex flex-col">
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 border border-[#00ff00] flex items-center justify-center text-2xl bg-[#1a2f26]">
                    🤖
                  </div>
                  <div className="flex flex-col flex-1 justify-center">
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{profile?.name?.toUpperCase() || 'USER'}</span>
                    <span style={{ color: '#00aa00' }}>Level 7</span>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <div className="flex-1 h-2 bg-[#1a2f26] border border-[#00ff00] relative">
                        <div className="absolute top-0 left-0 h-full bg-[#00ff00]" style={{ width: '62%' }}></div>
                      </div>
                      <span style={{ color: '#00aa00' }}>1240 / 2000 XP</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div>Rank: <span style={{ color: '#ffcc00' }}>Rookie</span></div>
                  <div>Coins: <span style={{ color: '#ffcc00' }}>530 🪙</span></div>
                </div>

                <div className="flex flex-col gap-2 mt-auto text-[#00aa00]">
                  <div>Games Played: 12</div>
                  <div>Kills: 89</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TASKBAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[800] flex items-center select-none"
        style={{
          height: 40,
          background: 'rgba(10, 6, 8, 0.95)',
          borderTop: '1px solid #1a2f26',
          fontFamily: 'monospace, var(--font-family)',
          color: '#00ff00',
          fontSize: '12px'
        }}
        onClick={() => startOpen && setStartOpen(false)}
      >
        {/* START button */}
        <button
          onClick={(e) => { e.stopPropagation(); setStartOpen((v) => !v); }}
          className="flex items-center justify-center gap-2 h-full px-6 transition-all border-r border-[#1a2f26] hover:bg-[#1a2f26]"
          style={{
            background: startOpen ? '#1a2f26' : 'transparent',
            color: '#00ff00',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          <span style={{ color: '#00ff00' }}>▶</span> START
        </button>

        {/* Open windows */}
        <div className="flex items-center flex-1 overflow-x-auto h-full px-2" style={{ gap: 4 }}>
          {windows.map((win) => (
            <button
              key={win.id}
              onClick={(e) => { e.stopPropagation(); handleTaskbarItem(win.id, win.status, win.isFocused); }}
              className="flex items-center gap-2 px-3 h-8 transition-all border border-[#1a2f26] hover:bg-[#1a2f26]"
              style={{
                background: win.isFocused && win.status !== 'minimized' ? '#1a2f26' : 'transparent',
                color: win.isFocused ? '#00ff00' : '#00aa00',
                opacity: win.status === 'minimized' ? 0.6 : 1,
              }}
            >
              <span>{getAppIcon(win.id)}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                {win.title.toUpperCase()}.exe
              </span>
            </button>
          ))}
        </div>

        {/* Right tray */}
        <div className="flex items-center h-full border-l border-[#1a2f26]">
          {/* Music Player Mini Widget */}
          <div className="flex items-center gap-3 px-4 h-full border-r border-[#1a2f26] text-[#00ff00]">
            <span>🎵</span>
            <div className="flex flex-col justify-center h-full">
              <span style={{ fontSize: '10px', lineHeight: '1' }}>CHIPTUNE DREAMS</span>
              <span style={{ fontSize: '9px', color: '#00aa00', lineHeight: '1' }}>By 8Bit Empire</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="cursor-pointer hover:text-white">⏮</span>
              <span className="cursor-pointer hover:text-white">⏸</span>
              <span className="cursor-pointer hover:text-white">⏭</span>
            </div>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-2 px-4 h-full border-r border-[#1a2f26] text-[#00ff00]">
            <div className="flex items-end gap-[1px] h-3">
              <div className="w-1 h-1 bg-[#00ff00]"></div>
              <div className="w-1 h-2 bg-[#00ff00]"></div>
              <div className="w-1 h-3 bg-[#00ff00]"></div>
              <div className="w-1 h-full bg-[#1a2f26]"></div>
            </div>
            <span>24ms</span>
          </div>

          {/* Clock */}
          <div className="flex flex-col justify-center items-end px-4 h-full text-[#00ff00]">
            <span style={{ fontSize: '12px', lineHeight: '1.2' }}>{time}</span>
            <span style={{ fontSize: '10px', color: '#00aa00', lineHeight: '1' }}>{date}</span>
          </div>
        </div>
      </div>
    </>
  );
}
