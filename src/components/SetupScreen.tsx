'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useAchievements } from '@/hooks/useAchievements';
import { OS_NAME } from '@/core/theme/themes';

const PROMPTS = ['>', '$', '#', '@', '~', '%'];

interface SetupScreenProps {
  onComplete: () => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [username, setUsername] = useState('');
  const [prompt, setPrompt] = useState('>');
  const { setupProfile } = useUserStore();
  const { unlock } = useAchievements();

  const handleSubmit = () => {
    if (!username.trim()) return;
    setupProfile(username.trim(), prompt);
    unlock('first_login');
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#0a0608', fontFamily: "'VT323', monospace" }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)',
      }} />

      <div className="w-full max-w-sm mx-4 relative z-10">
        {/* Title */}
        <div className="mb-6 text-center">
          <div style={{ color: '#ee2222', fontFamily: "'Press Start 2P', monospace", fontSize: 22, lineHeight: 1.5 }}>
            {OS_NAME}
          </div>
          <div style={{ color: '#ffcc33', fontSize: 20, marginTop: 4 }}>
            USER REGISTRATION
          </div>
        </div>

        <div style={{ border: '2px solid #ee2222', background: '#0a0608', boxShadow: '0 0 30px rgba(238,34,34,0.25)' }}>
          {/* Prompt selector */}
          <div className="px-5 pt-5 pb-3">
            <div style={{ color: '#555555', fontSize: 15, marginBottom: 8, letterSpacing: '0.1em' }}>
              SELECT_PROMPT_CHAR:
            </div>
            <div className="flex gap-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  style={{
                    width: 36, height: 36,
                    background: prompt === p ? '#ee2222' : 'transparent',
                    border: `1px solid ${prompt === p ? '#ee2222' : '#333333'}`,
                    color: prompt === p ? '#0a0608' : '#aaaaaa',
                    fontSize: 20,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Username input */}
          <div className="px-5 pb-5">
            <div style={{ color: '#555555', fontSize: 15, marginBottom: 8, letterSpacing: '0.1em' }}>
              ENTER_USERNAME:
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ border: '1px solid #ee2222', background: 'rgba(238,34,34,0.05)' }}
            >
              <span style={{ color: '#ee2222', fontSize: 20 }}>{prompt}</span>
              <input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="type username..."
                maxLength={18}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: 20,
                  caretColor: '#ee2222',
                  fontFamily: 'inherit',
                }}
              />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                style={{ color: '#ee2222', fontSize: 20 }}
              >█</motion.span>
            </div>
          </div>

          {/* Boot button */}
          <motion.button
            whileHover={{ background: '#ee2222', color: '#0a0608' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="w-full py-3 transition-all"
            style={{
              background: 'transparent',
              color: username.trim() ? '#ee2222' : '#333333',
              fontSize: 20,
              cursor: username.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              letterSpacing: '0.1em',
              border: 'none',
              borderTop: '2px solid #ee2222',
            }}
          >
            [ ENTER {OS_NAME} ]
          </motion.button>
        </div>

        <div className="mt-3 text-center" style={{ color: '#333333', fontSize: 14, letterSpacing: '0.08em' }}>
          PRESS ENTER OR CLICK TO CONTINUE
        </div>
      </div>
    </motion.div>
  );
}
