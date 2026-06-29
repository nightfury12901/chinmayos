'use client';
import { useEffect, useRef } from 'react';

// Pure CSS/SVG pixel-art walking characters for the desktop bottom
// Inspired by band5051.com pixel walkers

interface Character {
  id: string;
  svg: React.ReactNode;
  delay: number;     // animation-delay seconds
  duration: number;  // total walk duration seconds
  bottom: number;    // px from bottom of the desktop area
  scale: number;
}

const PunkGuy = (
  <svg viewBox="0 0 16 16" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
    <rect x="6" y="2" width="4" height="4" fill="#ffcc33" />
    <rect x="5" y="1" width="6" height="1" fill="#ee2222" />
    <rect x="7" y="0" width="2" height="1" fill="#ee2222" />
    <rect x="7" y="3" width="1" height="1" fill="#000" />
    <rect x="9" y="3" width="1" height="1" fill="#000" />
    <rect x="5" y="6" width="6" height="5" fill="#ee2222" />
    <rect x="6" y="8" width="4" height="1" fill="#ffcc33" />
    <rect x="4" y="6" width="1" height="4" fill="#ffcc33" />
    <rect x="11" y="6" width="1" height="4" fill="#ffcc33" />
    <rect x="6" y="11" width="1" height="3" fill="#222" />
    <rect x="9" y="11" width="1" height="3" fill="#222" />
    <rect x="5" y="14" width="2" height="1" fill="#ee2222" />
    <rect x="9" y="14" width="2" height="1" fill="#ee2222" />
  </svg>
);

const Robot = (
  <svg viewBox="0 0 16 16" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
    <rect x="5" y="3" width="6" height="5" fill="#aaa" />
    <rect x="4" y="4" width="1" height="3" fill="#ee2222" />
    <rect x="11" y="4" width="1" height="3" fill="#ee2222" />
    <rect x="6" y="4" width="1" height="1" fill="#ffcc33" />
    <rect x="9" y="4" width="1" height="1" fill="#ffcc33" />
    <rect x="6" y="6" width="4" height="1" fill="#222" />
    <rect x="7" y="1" width="2" height="2" fill="#555" />
    <rect x="7" y="0" width="2" height="1" fill="#ee2222" />
    <rect x="6" y="8" width="4" height="4" fill="#888" />
    <rect x="6" y="12" width="1" height="3" fill="#555" />
    <rect x="9" y="12" width="1" height="3" fill="#555" />
    <rect x="5" y="14" width="2" height="1" fill="#222" />
    <rect x="9" y="14" width="2" height="1" fill="#222" />
  </svg>
);

const Dog = (
  <svg viewBox="0 0 16 16" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
    <rect x="3" y="7" width="8" height="4" fill="#ffcc33" />
    <rect x="10" y="5" width="4" height="4" fill="#ffcc33" />
    <rect x="11" y="4" width="1" height="1" fill="#ffcc33" />
    <rect x="13" y="4" width="1" height="1" fill="#ffcc33" />
    <rect x="11" y="6" width="1" height="1" fill="#000" />
    <rect x="13" y="6" width="1" height="1" fill="#000" />
    <rect x="14" y="7" width="1" height="1" fill="#000" />
    <rect x="3" y="11" width="1" height="3" fill="#ee2222" />
    <rect x="5" y="11" width="1" height="3" fill="#ee2222" />
    <rect x="8" y="11" width="1" height="3" fill="#ee2222" />
    <rect x="10" y="11" width="1" height="3" fill="#ee2222" />
    <rect x="2" y="6" width="1" height="4" fill="#ffcc33" />
  </svg>
);

const Ghost = (
  <svg viewBox="0 0 16 16" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
    <rect x="4" y="3" width="8" height="10" fill="#fff" />
    <rect x="5" y="2" width="6" height="1" fill="#fff" />
    <rect x="6" y="1" width="4" height="1" fill="#fff" />
    <rect x="6" y="5" width="1" height="2" fill="#ee2222" />
    <rect x="9" y="5" width="1" height="2" fill="#ee2222" />
    <rect x="4" y="13" width="2" height="1" fill="#fff" />
    <rect x="7" y="13" width="2" height="1" fill="#fff" />
    <rect x="10" y="13" width="2" height="1" fill="#fff" />
  </svg>
);

const CHARACTERS: Character[] = [
  { id: 'c1', svg: PunkGuy, delay: 0,   duration: 22, bottom: 52, scale: 2.0 },
  { id: 'c2', svg: Robot,   delay: 7,   duration: 18, bottom: 54, scale: 1.8 },
  { id: 'c3', svg: Dog,     delay: 14,  duration: 26, bottom: 52, scale: 1.8 },
  { id: 'c4', svg: Ghost,   delay: 3,   duration: 20, bottom: 55, scale: 2.0 },
  { id: 'c5', svg: PunkGuy, delay: 19,  duration: 16, bottom: 53, scale: 1.5 },
];

export function PixelCharacters() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {CHARACTERS.map((char) => (
        <div
          key={char.id}
          style={{
            position: 'absolute',
            bottom: char.bottom,
            left: '-80px',
            width: `${Math.round(char.scale * 16)}px`,
            height: `${Math.round(char.scale * 16)}px`,
            lineHeight: 1,
            animation: `walk-across ${char.duration}s linear ${char.delay}s infinite, bob 0.4s ease-in-out infinite`,
            filter: 'drop-shadow(0 0 4px rgba(238,34,34,0.6))',
            willChange: 'transform, left',
          }}
        >
          {char.svg}
        </div>
      ))}
    </div>
  );
}
