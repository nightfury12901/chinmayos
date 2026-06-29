'use client';
import { useState, useRef, useEffect } from 'react';
import { useFSStore } from '@/store/fsStore';
import { useXPStore } from '@/store/xpStore';
import { useAchievements } from '@/hooks/useAchievements';
import { getNodeByPath, getChildren, resolvePath, getPath } from '@/core/fs/fsHelpers';
import type { FSDirectory, FSFile, FSNode } from '@/types/fs.types';
import { v4 as uuidv4 } from 'uuid';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
}

const BANNER = `
 ██████╗██╗  ██╗██╗███╗   ██╗███╗   ███╗ █████╗ ██╗   ██╗ ██████╗ ███████╗
██╔════╝██║  ██║██║████╗  ██║████╗ ████║██╔══██╗╚██╗ ██╔╝██╔═══██╗██╔════╝
██║     ███████║██║██╔██╗ ██║██╔████╔██║███████║ ╚████╔╝ ██║   ██║███████╗
██║     ██╔══██║██║██║╚██╗██║██║╚██╔╝██║██╔══██║  ╚██╔╝  ██║   ██║╚════██║
╚██████╗██║  ██║██║██║ ╚████║██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╔╝███████║
 ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝
Type 'help' for available commands.
`.trim();

export default function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: uuidv4(), type: 'output', content: BANNER },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [cwd, setCwd] = useState('/');
  const fsStore = useFSStore();
  const { addXP } = useXPStore();
  const { unlock } = useAchievements();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const print = (content: string, type: 'input' | 'output' | 'error' = 'output') => {
    setLines((prev) => [...prev, { id: uuidv4(), type, content }]);
  };

  const processCommand = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    print(`$ ${trimmed}`, 'input');
    setHistory((h) => [trimmed, ...h.slice(0, 49)]);
    setHistIdx(-1);

    unlock('terminal_explorer');

    const [cmd, ...args] = trimmed.split(/\s+/);
    const tree = fsStore.tree;

    switch (cmd) {
      case 'help':
        print(
          `Available commands:\n  help    - Show this help\n  ls      - List directory contents\n  pwd     - Print working directory\n  cd      - Change directory\n  mkdir   - Create directory\n  touch   - Create file\n  cat     - Print file contents\n  rm      - Remove file/directory\n  clear   - Clear terminal\n  echo    - Print text`
        );
        break;

      case 'pwd':
        print(cwd);
        break;

      case 'clear':
        setLines([]);
        break;

      case 'echo':
        print(args.join(' '));
        break;

      case 'ls': {
        if (!tree) { print('Filesystem not ready', 'error'); break; }
        const targetPath = args[0] ? resolvePath(cwd, args[0]) : cwd;
        const node = getNodeByPath(tree, targetPath);
        if (!node) { print(`ls: ${targetPath}: No such file or directory`, 'error'); break; }
        if (node.type === 'file') { print(node.name); break; }
        const children = getChildren(tree, node.id);
        if (!children.length) { print('(empty)'); break; }
        print(children.map((c) => (c.type === 'directory' ? `📁 ${c.name}/` : `📄 ${c.name}`)).join('\n'));
        break;
      }

      case 'cd': {
        if (!tree) { print('Filesystem not ready', 'error'); break; }
        const target = args[0] || '/';
        const newPath = resolvePath(cwd, target);
        const node = getNodeByPath(tree, newPath);
        if (!node) { print(`cd: ${target}: No such file or directory`, 'error'); break; }
        if (node.type !== 'directory') { print(`cd: ${target}: Not a directory`, 'error'); break; }
        setCwd(newPath);
        fsStore.setCwd(newPath);
        break;
      }

      case 'mkdir': {
        if (!args[0]) { print('mkdir: missing operand', 'error'); break; }
        if (!tree) { print('Filesystem not ready', 'error'); break; }
        const dirPath = resolvePath(cwd, args[0]);
        const parentPath = dirPath.split('/').slice(0, -1).join('/') || '/';
        const dirName = dirPath.split('/').pop()!;
        const parentNode = getNodeByPath(tree, parentPath);
        if (!parentNode || parentNode.type !== 'directory') { print(`mkdir: cannot create directory in '${parentPath}'`, 'error'); break; }
        await fsStore.mkdir(dirName, parentNode.id);
        print(`Created directory: ${dirPath}`);
        addXP(15, `mkdir ${dirName}`);
        break;
      }

      case 'touch': {
        if (!args[0]) { print('touch: missing operand', 'error'); break; }
        if (!tree) { print('Filesystem not ready', 'error'); break; }
        const filePath = resolvePath(cwd, args[0]);
        const parentPath = filePath.split('/').slice(0, -1).join('/') || '/';
        const fileName = filePath.split('/').pop()!;
        const parentNode = getNodeByPath(tree, parentPath);
        if (!parentNode || parentNode.type !== 'directory') { print(`touch: cannot create file in '${parentPath}'`, 'error'); break; }
        await fsStore.touch(fileName, parentNode.id, '');
        print(`Created: ${filePath}`);
        addXP(25, `touch ${fileName}`);
        unlock('file_creator');
        break;
      }

      case 'cat': {
        if (!args[0]) { print('cat: missing operand', 'error'); break; }
        if (!tree) { print('Filesystem not ready', 'error'); break; }
        const filePath = resolvePath(cwd, args[0]);
        const node = getNodeByPath(tree, filePath);
        if (!node) { print(`cat: ${args[0]}: No such file or directory`, 'error'); break; }
        if (node.type !== 'file') { print(`cat: ${args[0]}: Is a directory`, 'error'); break; }
        print((node as FSFile).content || '(empty file)');
        break;
      }

      case 'rm': {
        if (!args[0]) { print('rm: missing operand', 'error'); break; }
        if (!tree) { print('Filesystem not ready', 'error'); break; }
        const filePath = resolvePath(cwd, args[0]);
        const node = getNodeByPath(tree, filePath);
        if (!node) { print(`rm: ${args[0]}: No such file or directory`, 'error'); break; }
        await fsStore.rm(node.id);
        print(`Removed: ${filePath}`);
        break;
      }

      default:
        print(`${cmd}: command not found. Type 'help' for available commands.`, 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx] ?? '');
    }
  };

  return (
    <div
      className="flex flex-col h-full cursor-text"
      style={{ background: 'var(--color-bg)', fontFamily: "'Fira Code', 'Courier New', monospace" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output */}
      <div className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed">
        {lines.map((line) => (
          <div
            key={line.id}
            className="whitespace-pre-wrap break-all"
            style={{
              color:
                line.type === 'error'
                  ? 'var(--color-danger)'
                  : line.type === 'input'
                  ? 'var(--color-accent)'
                  : 'var(--color-text)',
            }}
          >
            {line.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <span className="text-sm" style={{ color: 'var(--color-primary)' }}>
          {cwd} $
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--color-text)', caretColor: 'var(--color-accent)' }}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <span
          className="w-2 h-4 animate-pulse"
          style={{ background: 'var(--color-accent)' }}
        />
      </div>
    </div>
  );
}
