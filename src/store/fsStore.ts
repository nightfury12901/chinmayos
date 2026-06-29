import { create } from 'zustand';
import type { FSTree, FSNode, FSFile, FSDirectory } from '@/types/fs.types';
import { VirtualFS, createFile } from '@/core/fs/VirtualFS';
import { getNodeByPath, getChildren, resolvePath } from '@/core/fs/fsHelpers';
import { v4 as uuidv4 } from 'uuid';

interface FSStore {
  tree: FSTree | null;
  initialized: boolean;
  cwd: string;
  init: () => Promise<void>;
  getNode: (path: string) => FSNode | null;
  getChildren: (nodeId: string) => FSNode[];
  mkdir: (name: string, parentId: string) => Promise<FSDirectory>;
  touch: (name: string, parentId: string, content?: string) => Promise<FSFile>;
  writeFile: (id: string, content: string) => Promise<void>;
  rm: (id: string) => Promise<void>;
  setCwd: (path: string) => void;
}

export const useFSStore = create<FSStore>((set, get) => ({
  tree: null,
  initialized: false,
  cwd: '/',

  init: async () => {
    const tree = await VirtualFS.init();
    set({ tree, initialized: true });
  },

  getNode: (path: string) => {
    const { tree } = get();
    if (!tree) return null;
    return getNodeByPath(tree, path);
  },

  getChildren: (nodeId: string) => {
    const { tree } = get();
    if (!tree) return [];
    return getChildren(tree, nodeId);
  },

  mkdir: async (name: string, parentId: string) => {
    const { tree } = get();
    if (!tree) throw new Error('FS not initialized');

    const newDir: FSDirectory = {
      id: uuidv4(),
      name,
      type: 'directory',
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children: [],
    };

    const parent = tree.nodes[parentId] as FSDirectory;
    const updatedParent = { ...parent, children: [...parent.children, newDir.id], updatedAt: Date.now() };

    await VirtualFS.saveNode(newDir);
    await VirtualFS.saveNode(updatedParent);

    set((state) => ({
      tree: state.tree
        ? {
            ...state.tree,
            nodes: {
              ...state.tree.nodes,
              [newDir.id]: newDir,
              [parentId]: updatedParent,
            },
          }
        : null,
    }));

    return newDir;
  },

  touch: async (name: string, parentId: string, content = '') => {
    const { tree } = get();
    if (!tree) throw new Error('FS not initialized');

    const newFile = createFile(name, parentId, content);
    const parent = tree.nodes[parentId] as FSDirectory;
    const updatedParent = { ...parent, children: [...parent.children, newFile.id], updatedAt: Date.now() };

    await VirtualFS.saveNode(newFile);
    await VirtualFS.saveNode(updatedParent);

    set((state) => ({
      tree: state.tree
        ? {
            ...state.tree,
            nodes: {
              ...state.tree.nodes,
              [newFile.id]: newFile,
              [parentId]: updatedParent,
            },
          }
        : null,
    }));

    return newFile;
  },

  writeFile: async (id: string, content: string) => {
    const { tree } = get();
    if (!tree) throw new Error('FS not initialized');
    const node = tree.nodes[id] as FSFile;
    const updated: FSFile = { ...node, content, size: content.length, updatedAt: Date.now() };
    await VirtualFS.saveNode(updated);
    set((state) => ({
      tree: state.tree
        ? { ...state.tree, nodes: { ...state.tree.nodes, [id]: updated } }
        : null,
    }));
  },

  rm: async (id: string) => {
    const { tree } = get();
    if (!tree) throw new Error('FS not initialized');
    const node = tree.nodes[id];
    if (!node) return;

    // Collect all descendant IDs
    const toDelete: string[] = [];
    const collect = (nid: string) => {
      const n = tree.nodes[nid];
      if (!n) return;
      toDelete.push(nid);
      if (n.type === 'directory') {
        (n as FSDirectory).children.forEach(collect);
      }
    };
    collect(id);

    for (const nid of toDelete) {
      await VirtualFS.deleteNode(nid);
    }

    // Remove from parent
    const updatedNodes = { ...tree.nodes };
    toDelete.forEach((nid) => delete updatedNodes[nid]);

    if (node.parentId && updatedNodes[node.parentId]) {
      const parent = updatedNodes[node.parentId] as FSDirectory;
      updatedNodes[node.parentId] = {
        ...parent,
        children: parent.children.filter((c) => c !== id),
        updatedAt: Date.now(),
      };
      await VirtualFS.saveNode(updatedNodes[node.parentId]);
    }

    set((state) => ({
      tree: state.tree ? { ...state.tree, nodes: updatedNodes } : null,
    }));
  },

  setCwd: (path: string) => set({ cwd: path }),
}));
