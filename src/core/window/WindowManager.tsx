'use client';
import { useWindowStore } from '@/store/windowStore';
import { WindowFrame } from './WindowFrame';
import { APP_COMPONENTS } from '@/apps/appComponents';
import type { WindowState } from '@/types/window.types';

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <>
      {windows.map((win) => (
        <WindowInstance key={win.id} win={win} />
      ))}
    </>
  );
}

function WindowInstance({ win }: { win: WindowState }) {
  const Component = APP_COMPONENTS[win.appId];
  if (!Component) return null;

  return (
    <WindowFrame windowId={win.id}>
      <Component windowId={win.id} {...(win.props ?? {})} />
    </WindowFrame>
  );
}
