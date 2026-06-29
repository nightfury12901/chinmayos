import type { Theme, ThemeId } from '@/types/theme.types';

export const OS_NAME = 'NEXOS';
export const OS_VERSION = '1.0.0';
export const OS_TAGLINE = 'ENTER THE VOID';

export const THEMES: Record<ThemeId, Theme> = {
  dark: {
    id: 'dark',
    name: 'Void Dark',
    fontFamily: "'VT323', 'Courier New', monospace",
    borderRadius: '0px',
    glassEffect: false,
    colors: {
      bg: '#0a0608',
      bgSecondary: '#110a0e',
      bgTertiary: '#1a0f14',
      surface: '#150b10',
      surfaceHover: '#201018',
      border: '#ee2222',
      primary: '#ee2222',
      primaryHover: '#ff4444',
      accent: '#ffcc33',
      text: '#ffffff',
      textMuted: '#aaaaaa',
      textDim: '#555555',
      success: '#00ee88',
      warning: '#ffcc33',
      danger: '#ff2222',
      taskbar: 'rgba(10,6,8,0.97)',
      windowChrome: 'rgba(10,6,8,0.97)',
      titleBar: '#150b10',
    },
  },
  'retro-green': {
    id: 'retro-green',
    name: 'Retro Green',
    fontFamily: "'VT323', 'Courier New', monospace",
    borderRadius: '0px',
    glassEffect: false,
    colors: {
      bg: '#000800',
      bgSecondary: '#001100',
      bgTertiary: '#001a00',
      surface: '#001100',
      surfaceHover: '#002200',
      border: '#00ff41',
      primary: '#00ff41',
      primaryHover: '#00cc33',
      accent: '#00ffaa',
      text: '#00ff41',
      textMuted: '#00aa2a',
      textDim: '#005510',
      success: '#00ff41',
      warning: '#aaff00',
      danger: '#ff4444',
      taskbar: 'rgba(0,8,0,0.97)',
      windowChrome: 'rgba(0,8,0,0.97)',
      titleBar: '#000800',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    fontFamily: "'VT323', 'Courier New', monospace",
    borderRadius: '0px',
    glassEffect: false,
    colors: {
      bg: '#06000e',
      bgSecondary: '#0d0018',
      bgTertiary: '#140022',
      surface: '#0d0018',
      surfaceHover: '#1a0028',
      border: '#ff2d78',
      primary: '#ff2d78',
      primaryHover: '#ff5090',
      accent: '#ffd600',
      text: '#f0e0ff',
      textMuted: '#aa77cc',
      textDim: '#663388',
      success: '#00ffaa',
      warning: '#ffd600',
      danger: '#ff2d78',
      taskbar: 'rgba(6,0,14,0.97)',
      windowChrome: 'rgba(6,0,14,0.97)',
      titleBar: '#0d0018',
    },
  },
};

export function applyThemeToCSSVars(theme: Theme) {
  const root = document.documentElement;
  const { colors } = theme;
  root.style.setProperty('--color-bg', colors.bg);
  root.style.setProperty('--color-bg-secondary', colors.bgSecondary);
  root.style.setProperty('--color-bg-tertiary', colors.bgTertiary);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-surface-hover', colors.surfaceHover);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-text-muted', colors.textMuted);
  root.style.setProperty('--color-text-dim', colors.textDim);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-danger', colors.danger);
  root.style.setProperty('--color-taskbar', colors.taskbar);
  root.style.setProperty('--color-window-chrome', colors.windowChrome);
  root.style.setProperty('--color-title-bar', colors.titleBar);
  root.style.setProperty('--font-family', theme.fontFamily);
  root.style.setProperty('--border-radius', theme.borderRadius);
}
