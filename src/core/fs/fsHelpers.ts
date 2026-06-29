import type { FSNode, FSDirectory, FSTree } from '@/types/fs.types';

export function getNodeByPath(tree: FSTree, path: string): FSNode | null {
  const parts = path.split('/').filter(Boolean);
  let current: FSNode = tree.nodes[tree.rootId];

  if (parts.length === 0) return current;

  for (const part of parts) {
    if (current.type !== 'directory') return null;
    const dir = current as FSDirectory;
    const child = dir.children
      .map((id) => tree.nodes[id])
      .find((n) => n?.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

export function getChildren(tree: FSTree, nodeId: string): FSNode[] {
  const node = tree.nodes[nodeId];
  if (!node || node.type !== 'directory') return [];
  return (node as FSDirectory).children
    .map((id) => tree.nodes[id])
    .filter(Boolean) as FSNode[];
}

export function getPath(tree: FSTree, nodeId: string): string {
  const parts: string[] = [];
  let current: FSNode | undefined = tree.nodes[nodeId];

  while (current && current.parentId !== null) {
    parts.unshift(current.name);
    current = current.parentId ? tree.nodes[current.parentId] : undefined;
  }

  return '/' + parts.join('/');
}

export function resolvePath(cwd: string, input: string): string {
  if (input.startsWith('/')) return normalizePath(input);
  const base = cwd.endsWith('/') ? cwd : cwd + '/';
  return normalizePath(base + input);
}

function normalizePath(p: string): string {
  const parts = p.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '..') stack.pop();
    else if (part !== '.') stack.push(part);
  }
  return '/' + stack.join('/');
}
