import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { WindowState, WindowConfig, WindowStatus } from '@/types/window.types';

const BASE_Z = 100;

interface WindowStore {
  windows: WindowState[];
  topZ: number;
  openWindow: (config: WindowConfig) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setWindowBounds: (id: string, x: number, y: number, width: number, height: number) => void;
  setWindowStatus: (id: string, status: WindowStatus) => void;
  getWindowById: (id: string) => WindowState | undefined;
  getFocusedWindow: () => WindowState | undefined;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZ: BASE_Z,

  openWindow: (config) => {
    const id = uuidv4();
    const { topZ } = get();
    const newZ = topZ + 1;
    const offset = get().windows.length * 24;

    const win: WindowState = {
      id,
      appId: config.appId,
      title: config.title,
      icon: config.icon,
      status: 'normal',
      zIndex: newZ,
      x: 80 + offset,
      y: 60 + offset,
      width: config.defaultWidth ?? 800,
      height: config.defaultHeight ?? 560,
      minWidth: config.minWidth ?? 320,
      minHeight: config.minHeight ?? 240,
      isFocused: true,
      isResizable: config.isResizable ?? true,
      props: config.props,
    };

    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, isFocused: false })).concat(win),
      topZ: newZ,
    }));

    return id;
  },

  closeWindow: (id) => {
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) }));
  },

  focusWindow: (id) => {
    const { topZ } = get();
    const newZ = topZ + 1;
    set((state) => ({
      windows: state.windows.map((w) => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? newZ : w.zIndex,
      })),
      topZ: newZ,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, status: 'minimized', isFocused: false } : w
      ),
    }));
  },

  restoreWindow: (id) => {
    const { topZ } = get();
    const newZ = topZ + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, status: 'normal', isFocused: true, zIndex: newZ } : { ...w, isFocused: false }
      ),
      topZ: newZ,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, status: w.status === 'maximized' ? 'normal' : 'maximized' } : w
      ),
    }));
  },

  setWindowBounds: (id, x, y, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y, width, height } : w
      ),
    }));
  },

  setWindowStatus: (id, status) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, status } : w)),
    }));
  },

  getWindowById: (id) => get().windows.find((w) => w.id === id),
  getFocusedWindow: () => get().windows.find((w) => w.isFocused),
}));
