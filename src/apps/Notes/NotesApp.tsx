'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFSStore } from '@/store/fsStore';
import { useAchievements } from '@/hooks/useAchievements';
import { useXPStore } from '@/store/xpStore';
import { v4 as uuidv4 } from 'uuid';
import { getNodeByPath, getChildren } from '@/core/fs/fsHelpers';
import type { FSFile, FSDirectory } from '@/types/fs.types';

interface Note {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fsStore = useFSStore();
  const { unlock } = useAchievements();
  const { addXP } = useXPStore();

  const getNotesDir = useCallback(() => {
    const { tree } = fsStore;
    if (!tree) return null;
    return getNodeByPath(tree, '/Documents') as FSDirectory | null;
  }, [fsStore]);

  // Load notes from filesystem
  useEffect(() => {
    if (!fsStore.initialized) return;
    const dir = getNotesDir();
    if (!dir || !fsStore.tree) return;
    const children = getChildren(fsStore.tree, dir.id);
    const noteFiles = children
      .filter((c) => c.type === 'file' && c.name.endsWith('.note'))
      .map((c) => {
        const f = c as FSFile;
        return { id: f.id, name: f.name.replace('.note', ''), content: f.content, updatedAt: f.updatedAt };
      });
    setNotes(noteFiles);
  }, [fsStore.initialized, fsStore.tree, getNotesDir]);

  const selectNote = (note: Note) => {
    setSelected(note.id);
    setEditorContent(note.content);
  };

  const autoSave = useCallback(
    async (id: string, content: string) => {
      await fsStore.writeFile(id, content);
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content, updatedAt: Date.now() } : n)));
    },
    [fsStore]
  );

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    if (!selected) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => autoSave(selected, content), 800);
  };

  const createNote = async () => {
    if (!newName.trim()) return;
    const dir = getNotesDir();
    if (!dir) return;
    const file = await fsStore.touch(`${newName.trim()}.note`, dir.id, '');
    const note: Note = { id: file.id, name: newName.trim(), content: '', updatedAt: Date.now() };
    setNotes((prev) => [...prev, note]);
    setSelected(note.id);
    setEditorContent('');
    setNewName('');
    setIsCreating(false);
    addXP(25, 'Created note');
    unlock('note_taker');
  };

  const deleteNote = async (id: string) => {
    await fsStore.rm(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selected === id) { setSelected(null); setEditorContent(''); }
  };

  const selectedNote = notes.find((n) => n.id === selected);

  return (
    <div className="flex h-full" style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      {/* Sidebar */}
      <div className="w-52 flex flex-col shrink-0" style={{ borderRight: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        <div className="p-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Notes</span>
          <button
            onClick={() => setIsCreating(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-lg transition-colors"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >+</button>
        </div>

        {isCreating && (
          <div className="p-2 flex gap-1">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNote()}
              placeholder="Note name..."
              className="flex-1 px-2 py-1 rounded text-xs outline-none"
              style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-primary)' }}
            />
            <button onClick={createNote} className="text-xs px-1.5 py-1 rounded" style={{ background: 'var(--color-primary)', color: '#fff' }}>✓</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-xs" style={{ color: 'var(--color-text-dim)' }}>
              No notes yet.<br />Click + to create one.
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer group"
                style={{
                  background: selected === note.id ? 'var(--color-surface)' : 'transparent',
                  borderLeft: selected === note.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                }}
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{note.name}</div>
                  <div className="text-[10px] truncate" style={{ color: 'var(--color-text-dim)' }}>
                    {note.content.slice(0, 30) || 'Empty'}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-opacity"
                  style={{ color: 'var(--color-danger)' }}
                >🗑</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="px-4 py-2.5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{selectedNote.name}</span>
              <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>
                {new Date(selectedNote.updatedAt).toLocaleTimeString()}
              </span>
            </div>
            <textarea
              className="flex-1 p-4 resize-none outline-none text-sm leading-relaxed"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-family)',
              }}
              value={editorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Select a note or create one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
