'use client';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useFSStore } from '@/store/fsStore';
import { getNodeByPath, getChildren } from '@/core/fs/fsHelpers';
import type { FSNode, FSFile, FSDirectory } from '@/types/fs.types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

function getLang(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    py: 'python', json: 'json', html: 'html', css: 'css', md: 'markdown',
    txt: 'plaintext',
  };
  return map[ext ?? ''] ?? 'plaintext';
}

export default function CodeEditorApp() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [sidebarNodes, setSidebarNodes] = useState<FSNode[]>([]);
  const fsStore = useFSStore();

  useEffect(() => {
    if (!fsStore.initialized || !fsStore.tree) return;
    const root = fsStore.tree.nodes[fsStore.tree.rootId] as FSDirectory;
    const children = getChildren(fsStore.tree, root.id);
    setSidebarNodes(children);
  }, [fsStore.initialized, fsStore.tree]);

  const openFile = (node: FSFile) => {
    const existing = tabs.find((t) => t.id === node.id);
    if (existing) { setActiveTab(node.id); return; }
    const tab: Tab = {
      id: node.id,
      name: node.name,
      content: node.content,
      language: getLang(node.name),
      isDirty: false,
    };
    setTabs((prev) => [...prev, tab]);
    setActiveTab(node.id);
  };

  const closeTab = (id: string) => {
    const idx = tabs.findIndex((t) => t.id === id);
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeTab === id) {
      const remaining = tabs.filter((t) => t.id !== id);
      setActiveTab(remaining.length > 0 ? remaining[Math.max(0, idx - 1)].id : null);
    }
  };

  const saveFile = async (id: string) => {
    const tab = tabs.find((t) => t.id === id);
    if (!tab) return;
    await fsStore.writeFile(id, tab.content);
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, isDirty: false } : t)));
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeTab || !value === undefined) return;
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTab ? { ...t, content: value ?? t.content, isDirty: true } : t))
    );
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="flex h-full" style={{ fontFamily: 'var(--font-family)', background: 'var(--color-bg)' }}>
      {/* File tree sidebar */}
      <div
        className="w-44 shrink-0 overflow-y-auto"
        style={{ background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Files
        </div>
        <FileTree nodes={sidebarNodes} tree={fsStore.tree} onOpenFile={openFile} depth={0} />
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col">
        {/* Tab bar */}
        <div
          className="flex items-center overflow-x-auto shrink-0"
          style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer text-xs whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? 'var(--color-bg)' : 'transparent',
                borderRight: '1px solid var(--color-border)',
                color: activeTab === tab.id ? 'var(--color-text)' : 'var(--color-text-muted)',
                borderTop: activeTab === tab.id ? '1px solid var(--color-primary)' : '1px solid transparent',
              }}
            >
              {tab.isDirty && <span style={{ color: 'var(--color-warning)' }}>●</span>}
              {tab.name}
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="ml-1 opacity-50 hover:opacity-100"
                style={{ color: 'var(--color-text-muted)' }}
              >×</button>
            </div>
          ))}
          {tabs.length === 0 && (
            <div className="px-3 py-2 text-xs" style={{ color: 'var(--color-text-dim)' }}>
              Open a file from the sidebar
            </div>
          )}
        </div>

        {/* Save shortcut hint */}
        {activeTabData?.isDirty && (
          <div className="px-3 py-1 text-[10px] flex items-center gap-2" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
            <span>Unsaved changes</span>
            <button onClick={() => saveFile(activeTab!)} className="underline" style={{ color: 'var(--color-accent)' }}>
              Save (Ctrl+S)
            </button>
          </div>
        )}

        {/* Monaco */}
        {activeTabData ? (
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={activeTabData.language}
              value={activeTabData.content}
              theme="vs-dark"
              onChange={handleEditorChange}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 12 },
                scrollBeyondLastLine: false,
              }}
              onMount={(editor, monaco) => {
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                  if (activeTab) saveFile(activeTab);
                });
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">⌨️</div>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Open a file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileTree({
  nodes,
  tree,
  onOpenFile,
  depth,
}: {
  nodes: FSNode[];
  tree: ReturnType<typeof useFSStore.getState>['tree'];
  onOpenFile: (f: FSFile) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <>
      {nodes.map((node) => {
        const isDir = node.type === 'directory';
        const isExpanded = expanded[node.id];
        const children = isDir && tree ? getChildren(tree, node.id) : [];

        return (
          <div key={node.id}>
            <div
              className="flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-opacity-10 text-xs truncate"
              style={{ paddingLeft: `${8 + depth * 12}px`, color: 'var(--color-text-muted)' }}
              onClick={() => {
                if (isDir) setExpanded((p) => ({ ...p, [node.id]: !p[node.id] }));
                else onOpenFile(node as FSFile);
              }}
            >
              <span>{isDir ? (isExpanded ? '📂' : '📁') : '📄'}</span>
              <span className="truncate">{node.name}</span>
            </div>
            {isDir && isExpanded && children.length > 0 && (
              <FileTree nodes={children} tree={tree} onOpenFile={onOpenFile} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </>
  );
}
