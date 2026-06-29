export type WindowStatus = 'normal' | 'minimized' | 'maximized';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  status: WindowStatus;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isFocused: boolean;
  isResizable: boolean;
  props?: Record<string, unknown>;
}

export interface WindowConfig {
  appId: string;
  title: string;
  icon: string;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  isResizable?: boolean;
  props?: Record<string, unknown>;
}
