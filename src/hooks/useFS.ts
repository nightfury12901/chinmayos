'use client';
import { useFSStore } from '@/store/fsStore';
import { useXPStore } from '@/store/xpStore';
import { useAchievementStore } from '@/store/achievementStore';
import { getNodeByPath, getChildren, resolvePath } from '@/core/fs/fsHelpers';

export function useFS() {
  const store = useFSStore();
  const { addXP } = useXPStore();
  const { unlock } = useAchievementStore();

  const createFile = async (name: string, parentId: string, content = '') => {
    const file = await store.touch(name, parentId, content);
    addXP(25, `Created file: ${name}`);
    unlock('file_creator');
    return file;
  };

  const createFolder = async (name: string, parentId: string) => {
    return store.mkdir(name, parentId);
  };

  const writeFile = async (id: string, content: string) => {
    return store.writeFile(id, content);
  };

  const deleteNode = async (id: string) => {
    return store.rm(id);
  };

  const getNode = (path: string) => {
    if (!store.tree) return null;
    return getNodeByPath(store.tree, path);
  };

  const listChildren = (nodeId: string) => {
    if (!store.tree) return [];
    return getChildren(store.tree, nodeId);
  };

  return {
    tree: store.tree,
    initialized: store.initialized,
    cwd: store.cwd,
    setCwd: store.setCwd,
    createFile,
    createFolder,
    writeFile,
    deleteNode,
    getNode,
    listChildren,
  };
}
