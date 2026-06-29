'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useFSStore } from '@/store/fsStore';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

type Intent =
  | { type: 'open_app'; appId: string }
  | { type: 'create_folder'; name: string }
  | { type: 'create_file'; name: string }
  | { type: 'chat'; response: string };

function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();

  // open app intent
  const appMap: Record<string, string> = {
    terminal: 'terminal', 'code editor': 'code-editor', editor: 'code-editor',
    notes: 'notes', note: 'notes', browser: 'browser', 'flappy bird': 'flappy-bird',
    flappy: 'flappy-bird', sniper: 'sniper-mission', files: 'file-manager',
    'file manager': 'file-manager', settings: 'settings', ai: 'ai-assistant',
  };
  for (const [key, appId] of Object.entries(appMap)) {
    if (lower.includes(`open ${key}`) || lower.includes(`launch ${key}`) || lower.includes(`start ${key}`)) {
      return { type: 'open_app', appId };
    }
  }

  // create folder intent
  const folderMatch = lower.match(/create(?:\s+a)?\s+folder\s+(?:called\s+|named\s+)?["']?([a-z0-9 _-]+)["']?/i);
  if (folderMatch) return { type: 'create_folder', name: folderMatch[1].trim() };

  // create file intent
  const fileMatch = lower.match(/create(?:\s+a)?\s+file\s+(?:called\s+|named\s+)?["']?([a-z0-9 ._-]+)["']?/i);
  if (fileMatch) return { type: 'create_file', name: fileMatch[1].trim() };

  // generic chat
  const responses = [
    "I'm ChinmayOS AI — your intelligent assistant! I can open apps, create files, and help you navigate the OS.",
    "Try saying: 'Open terminal', 'Launch Flappy Bird', or 'Create folder projects'.",
    "I can control your OS! Ask me to open apps or create files.",
    "This is ChinmayOS v1.0 — a complete browser-based OS experience. What would you like to do?",
    "Coming soon: full AI integration with OpenAI/Gemini. For now, I'm your trusty mock assistant!",
  ];
  return { type: 'chat', response: responses[Math.floor(Math.random() * responses.length)] };
}

export default function AIAssistantApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: "👋 Hi! I'm your ChinmayOS AI assistant. I can:\n• Open apps (say 'open terminal')\n• Launch games (say 'launch Flappy Bird')\n• Create files and folders\n\nWhat can I do for you?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { launchApp } = useWindowManager();
  const fsStore = useFSStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: uuidv4(), role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const intent = detectIntent(text);
    let response = '';

    if (intent.type === 'open_app') {
      launchApp(intent.appId);
      response = `✅ Launching ${intent.appId}...`;
    } else if (intent.type === 'create_folder') {
      const { tree } = fsStore;
      if (tree) {
        const root = tree.nodes[tree.rootId];
        if (root.type === 'directory') {
          await fsStore.mkdir(intent.name, root.id);
          response = `✅ Created folder '${intent.name}' in root directory.`;
        }
      }
    } else if (intent.type === 'create_file') {
      const { tree } = fsStore;
      if (tree) {
        const root = tree.nodes[tree.rootId];
        if (root.type === 'directory') {
          await fsStore.touch(intent.name, root.id, '');
          response = `✅ Created file '${intent.name}' in root directory.`;
        }
      }
    } else {
      response = intent.response;
    }

    const aiMsg: Message = { id: uuidv4(), role: 'assistant', content: response, timestamp: Date.now() };
    setMessages((prev) => [...prev, aiMsg]);
    setThinking(false);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl" style={{ background: 'var(--color-primary)' }}>
          🤖
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>ChinmayOS AI</div>
          <div className="text-[10px]" style={{ color: 'var(--color-accent)' }}>● Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed"
              style={{
                background: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {thinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div
              className="px-4 py-2.5 rounded-2xl flex items-center gap-1.5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-text-muted)' }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 p-3 shrink-0"
        style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask me to open apps, create files..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={!input.trim() || thinking}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-opacity"
          style={{ background: 'var(--color-primary)', opacity: !input.trim() || thinking ? 0.5 : 1 }}
        >
          ➤
        </motion.button>
      </div>
    </div>
  );
}
