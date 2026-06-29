'use client';
import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
}

const PLAYLIST: Track[] = [
  { id: 't1', title: 'LO-FI HIP HOP RADIO', artist: 'Chillhop Music', youtubeId: 'jfKfPfyJRdk' },
  { id: 't2', title: 'CHIPTUNE BEATS', artist: '8-BIT UNIVERSE', youtubeId: '_qNBSZ-oScY' },
  { id: 't3', title: 'SYNTHWAVE RADIO', artist: 'RETROWAVE.FM', youtubeId: '4xDzrJKXOOY' },
  { id: 't4', title: 'DARK AMBIENT MIX', artist: 'VOID STATION', youtubeId: 'S_MOd40zlYU' },
  { id: 't5', title: 'PIXEL JAMS VOL.1', artist: 'ARCADE DREAMS', youtubeId: 'Dx5qFachd3A' },
];

export default function MusicPlayerApp() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const current = PLAYLIST[currentIdx];

  const getSrc = (track: Track) =>
    `https://www.youtube.com/embed/${track.youtubeId}?autoplay=${playing ? 1 : 0}&controls=0&modestbranding=1&rel=0&enablejsapi=1`;

  const prev = () => setCurrentIdx((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  const next = () => setCurrentIdx((i) => (i + 1) % PLAYLIST.length);

  const togglePlay = () => setPlaying((p) => !p);

  // Reload iframe when track changes
  const [iframeSrc, setIframeSrc] = useState('');
  useEffect(() => {
    setIframeSrc('');
    const t = setTimeout(() => {
      setIframeSrc(`https://www.youtube.com/embed/${current.youtubeId}?autoplay=${playing ? 1 : 0}&controls=0&modestbranding=1&rel=0`);
    }, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  useEffect(() => {
    if (!iframeSrc) return;
    const autoplay = playing ? 1 : 0;
    setIframeSrc(`https://www.youtube.com/embed/${current.youtubeId}?autoplay=${autoplay}&controls=0&modestbranding=1&rel=0`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--color-bg)', fontFamily: "'VT323', monospace" }}
    >
      {/* Hidden YouTube iframe */}
      {iframeSrc && (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
          allow="autoplay; encrypted-media"
          title="Music player"
        />
      )}

      {/* Visualizer bars */}
      <div
        className="flex items-end justify-center gap-1 shrink-0"
        style={{ height: 80, background: '#150b10', borderBottom: '1px solid var(--color-border)', padding: '8px 16px' }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-accent)' : '#ffffff',
              animation: playing ? `bob ${0.4 + (i % 5) * 0.12}s ease-in-out ${(i % 7) * 0.06}s infinite` : 'none',
              height: playing ? undefined : 4,
              minHeight: 4,
              maxHeight: 56,
            }}
          />
        ))}
      </div>

      {/* Track info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4" style={{ gap: 8 }}>
        <div style={{ color: 'var(--color-text-dim)', fontSize: 16, letterSpacing: '0.1em' }}>
          NOW PLAYING
        </div>
        <div
          style={{
            color: 'var(--color-accent)',
            fontSize: 22,
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          {current.title}
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 18 }}>
          {current.artist}
        </div>

        {/* Blinking play indicator */}
        {playing && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'blink 0.8s step-start infinite',
              boxShadow: '0 0 8px var(--color-primary)',
            }}
          />
        )}
      </div>

      {/* Playlist */}
      <div style={{ borderTop: '1px solid var(--color-border)', maxHeight: 140, overflowY: 'auto' }}>
        {PLAYLIST.map((track, idx) => (
          <div
            key={track.id}
            onClick={() => { setCurrentIdx(idx); setPlaying(true); }}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer select-none transition-all"
            style={{
              background: idx === currentIdx ? 'rgba(238,34,34,0.12)' : 'transparent',
              borderBottom: '1px solid rgba(238,34,34,0.15)',
            }}
            onMouseEnter={(e) => { if (idx !== currentIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { if (idx !== currentIdx) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ color: idx === currentIdx ? 'var(--color-primary)' : 'var(--color-text-dim)', fontSize: 14 }}>
              {idx === currentIdx && playing ? '▶' : String(idx + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <div style={{ color: idx === currentIdx ? 'var(--color-accent)' : 'var(--color-text)', fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {track.title}
              </div>
              <div style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>{track.artist}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderTop: '2px solid var(--color-border)', background: '#150b10' }}
      >
        {/* Prev */}
        <button
          onClick={prev}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: 22, cursor: 'pointer', padding: '4px 8px', fontFamily: 'inherit' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >◀◀</button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="px-6 py-2 transition-all"
          style={{
            background: playing ? 'var(--color-primary)' : 'transparent',
            border: '2px solid var(--color-primary)',
            color: playing ? 'var(--color-bg)' : 'var(--color-primary)',
            fontSize: 20,
            cursor: 'pointer',
            minWidth: 80,
            fontFamily: 'inherit',
          }}
        >
          {playing ? '⏸ PAUSE' : '▶ PLAY'}
        </button>

        {/* Next */}
        <button
          onClick={next}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: 22, cursor: 'pointer', padding: '4px 8px', fontFamily: 'inherit' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >▶▶</button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--color-text-dim)', fontSize: 16 }}>♪</span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: 64, accentColor: 'var(--color-primary)' }}
          />
        </div>
      </div>
    </div>
  );
}
