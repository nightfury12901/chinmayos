import { openDB, type IDBPDatabase } from 'idb';
import type { FSNode, FSFile, FSDirectory, FSTree } from '@/types/fs.types';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'chinmayos-fs';
const DB_VERSION = 1;
const STORE_NAME = 'nodes';
const ROOT_META_KEY = '__root__';

let db: IDBPDatabase | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('meta')) {
          database.createObjectStore('meta');
        }
      },
    });
  }
  return db;
}

export const VirtualFS = {
  async init(): Promise<FSTree> {
    const database = await getDB();
    const rootId: string | undefined = await database.get('meta', ROOT_META_KEY);

    if (rootId) {
      const nodes = await database.getAll(STORE_NAME);
      const tree: FSTree = {
        nodes: Object.fromEntries(nodes.map((n: FSNode) => [n.id, n])),
        rootId,
      };
      return tree;
    }

    // Create default tree
    const root = createDir('/', null);
    const docs = createDir('Documents', root.id);
    const downloads = createDir('Downloads', root.id);
    const games = createDir('Games', root.id);
    const projects = createDir('Projects', root.id);
    const system = createDir('System', root.id);

    root.children = [docs.id, downloads.id, games.id, projects.id, system.id];

    const all = [root, docs, downloads, games, projects, system];
    const tx = database.transaction([STORE_NAME, 'meta'], 'readwrite');
    for (const node of all) {
      tx.objectStore(STORE_NAME).put(node);
    }
    tx.objectStore('meta').put(root.id, ROOT_META_KEY);
    await tx.done;

    const tree: FSTree = {
      nodes: Object.fromEntries(all.map((n) => [n.id, n])),
      rootId: root.id,
    };
    return tree;
  },

  async saveNode(node: FSNode): Promise<void> {
    const database = await getDB();
    await database.put(STORE_NAME, node);
  },

  async deleteNode(id: string): Promise<void> {
    const database = await getDB();
    await database.delete(STORE_NAME, id);
  },

  async loadAll(): Promise<FSNode[]> {
    const database = await getDB();
    return database.getAll(STORE_NAME);
  },
};

function createDir(name: string, parentId: string | null): FSDirectory {
  return {
    id: uuidv4(),
    name,
    type: 'directory',
    parentId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    children: [],
  };
}

export function createFile(name: string, parentId: string, content = ''): FSFile {
  return {
    id: uuidv4(),
    name,
    type: 'file',
    parentId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content,
    mimeType: getMimeType(name),
    size: content.length,
  };
}

function getMimeType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    txt: 'text/plain',
    md: 'text/markdown',
    js: 'text/javascript',
    ts: 'text/typescript',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    py: 'text/x-python',
  };
  return map[ext ?? ''] ?? 'text/plain';
}
