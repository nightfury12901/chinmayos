import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const Terminal = dynamic(() => import('./Terminal/TerminalApp'), { ssr: false });
const Notes = dynamic(() => import('./Notes/NotesApp'), { ssr: false });
const Browser = dynamic(() => import('./Browser/BrowserApp'), { ssr: false });
const AIAssistant = dynamic(() => import('./AIAssistant/AIAssistantApp'), { ssr: false });
const CodeEditor = dynamic(() => import('./CodeEditor/CodeEditorApp'), { ssr: false });
const FileManager = dynamic(() => import('./FileManager/FileManagerApp'), { ssr: false });
const FlappyBird = dynamic(() => import('@/games/FlappyBird/FlappyBirdGame'), { ssr: false });
const SniperMission = dynamic(() => import('@/games/SniperMission/SniperMissionGame'), { ssr: false });
const Settings = dynamic(() => import('./Settings/SettingsApp'), { ssr: false });
const MusicPlayer = dynamic(() => import('./MusicPlayer/MusicPlayerApp'), { ssr: false });

export const APP_COMPONENTS: Record<string, ComponentType<Record<string, unknown>>> = {
  terminal: Terminal as ComponentType<Record<string, unknown>>,
  notes: Notes as ComponentType<Record<string, unknown>>,
  browser: Browser as ComponentType<Record<string, unknown>>,
  'ai-assistant': AIAssistant as ComponentType<Record<string, unknown>>,
  'code-editor': CodeEditor as ComponentType<Record<string, unknown>>,
  'file-manager': FileManager as ComponentType<Record<string, unknown>>,
  'flappy-bird': FlappyBird as ComponentType<Record<string, unknown>>,
  'sniper-mission': SniperMission as ComponentType<Record<string, unknown>>,
  settings: Settings as ComponentType<Record<string, unknown>>,
  'music-player': MusicPlayer as ComponentType<Record<string, unknown>>,
};
