'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const BOOKMARKS = [
  { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
  { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { name: 'YouTube', url: 'https://www.youtube.com', icon: '📺' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org', icon: '📖' },
  { name: 'MDN', url: 'https://developer.mozilla.org', icon: '📚' },
];

export default function BrowserApp() {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = (target: string) => {
    let nav = target.trim();
    if (!nav) return;
    if (!nav.startsWith('http://') && !nav.startsWith('https://')) {
      if (nav.includes('.') && !nav.includes(' ')) {
        nav = 'https://' + nav;
      } else {
        nav = `https://www.google.com/search?q=${encodeURIComponent(nav)}`;
      }
    }
    setCurrentUrl(nav);
    setUrl(nav);
    setLoading(true);
    setError('');
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      {/* Browser bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}
      >
        {/* Arrows placeholder */}
        <button className="text-sm px-1.5 opacity-50" style={{ color: 'var(--color-text-muted)' }}>←</button>
        <button className="text-sm px-1.5 opacity-50" style={{ color: 'var(--color-text-muted)' }}>→</button>
        <button onClick={() => navigate(currentUrl)} className="text-sm px-1.5" style={{ color: 'var(--color-text-muted)' }}>↺</button>

        {/* URL bar */}
        <form
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}
          onSubmit={(e) => { e.preventDefault(); navigate(url); }}
        >
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>🌐</span>
          <input
            ref={inputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Search or enter URL..."
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: 'var(--color-text)' }}
          />
        </form>
      </div>

      {/* Content */}
      {!currentUrl ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-5xl mb-3">🌐</div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>ChinmayOS Browser</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Enter a URL or search above</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-md">
            {BOOKMARKS.map((bm) => (
              <motion.button
                key={bm.url}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate(bm.url)}
                className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <span className="text-2xl">{bm.icon}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{bm.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          {loading && (
            <div
              className="absolute top-0 left-0 right-0 h-0.5 z-10"
              style={{ background: 'var(--color-primary)' }}
            >
              <motion.div
                className="h-full"
                style={{ background: 'var(--color-accent)' }}
                initial={{ width: '0%' }}
                animate={{ width: '80%' }}
                transition={{ duration: 1 }}
              />
            </div>
          )}
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError('Failed to load this page.'); }}
            title="Browser"
          />
        </div>
      )}
    </div>
  );
}
