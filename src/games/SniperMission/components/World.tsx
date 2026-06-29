import { useMemo } from 'react';
import * as THREE from 'three';

const WALL_COLOR = '#110a1f';
const FLOOR_COLOR = '#1a0a20';
const CEILING_COLOR = '#0a0a0a';
const NEON_GRID_COLOR = '#ee2222';
const NEON_GRID_COLOR_2 = '#ffcc33';
const OBSTACLE_COLOR = '#2a1a3a';

export function World() {
  // Generate random obstacles once
  const obstacles = useMemo(() => {
    const obs = [];
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      // Keep center clear for spawn
      if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
      
      const width = 2 + Math.random() * 4;
      const depth = 2 + Math.random() * 4;
      const height = 4 + Math.random() * 8;
      obs.push({ x, z, w: width, h: height, d: depth, key: i });
    }
    return obs;
  }, []);

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <pointLight position={[0, 15, 0]} intensity={2.5} color={NEON_GRID_COLOR} distance={60} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} />
      </mesh>
      
      <gridHelper args={[50, 25, NEON_GRID_COLOR, '#441111']} position={[0, 0.01, 0]} />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>
      
      <gridHelper args={[50, 25, NEON_GRID_COLOR_2, '#332211']} position={[0, 14.99, 0]} />

      {/* Arena Walls */}
      <mesh position={[0, 7.5, -25]}>
        <boxGeometry args={[50, 15, 1]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[0, 7.5, 25]}>
        <boxGeometry args={[50, 15, 1]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[25, 7.5, 0]}>
        <boxGeometry args={[1, 15, 50]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[-25, 7.5, 0]}>
        <boxGeometry args={[1, 15, 50]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>

      {/* Obstacles / Cover */}
      {obstacles.map(o => (
        <mesh key={o.key} position={[o.x, o.h / 2, o.z]}>
          <boxGeometry args={[o.w, o.h, o.d]} />
          <meshStandardMaterial color={OBSTACLE_COLOR} roughness={0.7} metalness={0.2} />
          {/* Edge highlights */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(o.w, o.h, o.d)]} />
            <lineBasicMaterial color={NEON_GRID_COLOR} opacity={0.2} transparent />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}
