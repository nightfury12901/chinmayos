export type FSNodeType = 'file' | 'directory';

export interface FSBase {
  id: string;
  name: string;
  type: FSNodeType;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface FSFile extends FSBase {
  type: 'file';
  content: string;
  mimeType: string;
  size: number;
}

export interface FSDirectory extends FSBase {
  type: 'directory';
  children: string[]; // child node IDs
}

export type FSNode = FSFile | FSDirectory;

export interface FSTree {
  nodes: Record<string, FSNode>;
  rootId: string;
}
