export type ThemeId = 'dark' | 'retro-green' | 'cyberpunk';

export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  surface: string;
  surfaceHover: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  text: string;
  textMuted: string;
  textDim: string;
  success: string;
  warning: string;
  danger: string;
  taskbar: string;
  windowChrome: string;
  titleBar: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
  fontFamily: string;
  borderRadius: string;
  glassEffect: boolean;
}
