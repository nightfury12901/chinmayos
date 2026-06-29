'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFSStore } from '@/store/fsStore';
import { getNodeByPath, getChildren } from '@/core/fs/fsHelpers';
import type { FSDirectory, FSNode, FSFile } from '@/types/fs.types';

export default function FileManagerApp() {
  const [path, setPath] = useState('/');
  const [selected, setSelected] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const fsStore = useFSStore();

  const currentNode = fsStore.tree ? getNodeByPath(fsStore.tree, path) : null;
  const children = (currentNode && fsStore.tree)
    ? getChildren(fsStore.tree, currentNode.id)
    : [];

  const navigate = (node: FSNode) => {
    if (node.type === 'directory') {
      setPath(path === '/' ? `/${node.name}` : `${path}/${node.name}`);
      setSelected(null);
    }
  };

  const goUp = () => {
    if (path === '/') return;
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    setPath(parts.length === 0 ? '/' : '/' + parts.join('/'));
    setSelected(null);
  };

  const deleteNode = async (node: FSNode) => {
    await fsStore.rm(node.id);
    setSelected(null);
  };

  const createFolder = async () => {
    if (!newFolderName.trim() || !currentNode) return;
    await fsStore.mkdir(newFolderName.trim(), currentNode.id);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const pathParts = ['/', ...path.split('/').filter(Boolean)];

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}
      >
        <button
          onClick={goUp}
          disabled={path === '/'}
          className="px-2.5 py-1.5 rounded-lg text-xs disabled:opacity-30 transition-colors"
          style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}
        >
          ← Up
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs flex-1">
          {pathParts.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span style={{ color: 'var(--color-text-dim)' }}>/</span>}
              <span style={{ color: i === pathParts.length - 1 ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {part}
              </span>
            </span>
          ))}
        </div>

        <button
          onClick={() => setIsCreatingFolder(true)}
          className="px-2.5 py-1.5 rounded-lg text-xs"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          + New Folder
        </button>
      </div>

      {/* New folder input */}
      {isCreatingFolder && (
        <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--color-bg-tertiary)', borderBottom: '1px solid var(--color-border)' }}>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Folder name:</span>
          <input
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            className="flex-1 px-2 py-1 rounded text-xs outline-none"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-primary)' }}
          />
          <button onClick={createFolder} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-primary)', color: '#fff' }}>Create</button>
          <button onClick={() => setIsCreatingFolder(false)} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--color-text-muted)' }}>Cancel</button>
        </div>
      )}

      {/* File grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {children.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-3xl">📭</span>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>This folder is empty</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}>
            <AnimatePresence>
              {children.map((node) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onDoubleClick={() => navigate(node)}
                  onClick={() => setSelected(node.id)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer group"
                  style={{
                    background: selected === node.id ? 'var(--color-surface)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected === node.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  }}
                >
                  <span className="text-3xl">{node.type === 'directory' ? '📁' : '📄'}</span>
                  <span className="text-[10px] text-center leading-tight w-full truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {node.name}
                  </span>
                  {selected === node.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNode(node); }}
                      className="text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'var(--color-danger)', color: '#fff' }}
                    >
                      Delete
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-1.5 text-[10px] flex items-center gap-3"
        style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-dim)' }}
      >
        <span>{children.length} item{children.length !== 1 ? 's' : ''}</span>
        {selected && (
          <span style={{ color: 'var(--color-text-muted)' }}>
            {children.find((c) => c.id === selected)?.name} selected
          </span>
        )}
      </div>
    </div>
  );
}
