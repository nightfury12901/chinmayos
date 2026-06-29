'use client';
import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  '★ WELCOME TO NEXOS — ENTER THE VOID ★',
  '/// SYSTEM ONLINE — ALL SERVICES RUNNING ///',
  '♦ ACHIEVEMENT SYSTEM ACTIVE ♦',
  '[ TIP ] CLICK ICONS TO LAUNCH APPS',
  '[ TIP ] DOUBLE-CLICK TITLEBAR TO MAXIMIZE',
  '★ FLAPPY BIRD & SNIPER MISSION AVAILABLE IN GAMES ★',
  '/// VIRTUAL FILESYSTEM — FULLY OPERATIONAL ///',
  '[ TIP ] TRY THE TERMINAL — TYPE help FOR COMMANDS',
  '♦ XP + COINS EARNED BY USING THE OS ♦',
  '★ FIND THE HIDDEN EASTER EGGS ★',
  '[ TIP ] START MENU → CLICK THE ■ BUTTON',
];

export function Ticker() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[810] overflow-hidden flex items-center"
      style={{
        height: 28,
        background: 'var(--color-primary)',
        borderBottom: '2px solid var(--color-accent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'ticker-scroll 40s linear infinite',
          fontSize: 14,
          fontFamily: "'VT323', monospace",
          letterSpacing: '0.08em',
          color: 'var(--color-bg)',
          fontWeight: 700,
          paddingTop: 2,
        }}
      >
        {MESSAGES.join('   ·   ')}
        &nbsp;&nbsp;&nbsp;&nbsp;
        {MESSAGES.join('   ·   ')}
      </div>
    </div>
  );
}
