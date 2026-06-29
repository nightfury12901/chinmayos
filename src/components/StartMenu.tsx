'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { APP_REGISTRY } from '@/core/apps/registry';
import { useWindowManager } from '@/hooks/useWindowManager';

interface StartMenuProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ['all', 'productivity', 'utilities', 'games', 'system'] as const;

export function StartMenu({ open, onClose }: StartMenuProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { launchApp } = useWindowManager();

  const filtered = APP_REGISTRY.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || app.category === activeCategory;
    return matchesSearch && matchesCat && app.startMenuEntry;
  });

  const handleLaunch = (appId: string) => {
    launchApp(appId);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Click-outside backdrop */}
          <div
            className="fixed inset-0 z-[900]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 16, scaleY: 0.92 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="fixed bottom-14 left-2 z-[901] w-72 overflow-hidden"
            style={{
              background: '#000800',
              border: '1px solid #00ff41',
              boxShadow: '0 0 30px rgba(0,255,65,0.3), inset 0 0 30px rgba(0,255,65,0.02)',
              transformOrigin: 'bottom left',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3"
              style={{ borderBottom: '1px solid #00ff41', background: 'rgba(0,255,65,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: 12 }}>
                  ■ CHINMAYOS v1.0
                </span>
              </div>
              <div className="flex items-center gap-1" style={{ borderBottom: '1px solid rgba(0,255,65,0.3)', paddingBottom: 6 }}>
                <span style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: 12 }}>&gt;</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="search apps_"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs"
                  style={{ color: '#00ff41', fontFamily: "'Fira Code', monospace", caretColor: '#00ff41' }}
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-0 overflow-x-auto" style={{ borderBottom: '1px solid rgba(0,255,65,0.3)' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 text-[10px] capitalize whitespace-nowrap transition-all"
                  style={{
                    background: activeCategory === cat ? '#00ff41' : 'transparent',
                    color: activeCategory === cat ? '#000800' : '#00aa2a',
                    fontFamily: "'Fira Code', monospace",
                    borderRight: '1px solid rgba(0,255,65,0.2)',
                  }}
                >
                  [{cat}]
                </button>
              ))}
            </div>

            {/* App list */}
            <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
              {filtered.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleLaunch(app.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
                  style={{
                    color: '#00ff41',
                    fontFamily: "'Fira Code', monospace",
                    borderBottom: '1px solid rgba(0,255,65,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,255,65,0.12)';
                    e.currentTarget.style.color = '#aaffaa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#00ff41';
                  }}
                >
                  <span className="text-lg w-6 shrink-0">{app.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium">{app.name}</div>
                    <div className="text-[10px]" style={{ color: '#005510' }}>{app.description}</div>
                  </div>
                  <span className="ml-auto text-[10px]" style={{ color: '#005510' }}>▶</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(0,255,65,0.3)', background: 'rgba(0,255,65,0.04)' }}
            >
              <span className="text-[10px]" style={{ color: '#005510', fontFamily: 'monospace' }}>
                {filtered.length} apps
              </span>
              <button
                onClick={() => handleLaunch('settings')}
                className="text-[10px]"
                style={{ color: '#00aa2a', fontFamily: 'monospace' }}
              >
                [settings]
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
