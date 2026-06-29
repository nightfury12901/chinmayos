import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface WeaponProps {
  onShoot: () => void;
}

export function Weapon({ onShoot }: WeaponProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  
  // Recoil state
  const isRecoiling = useRef(false);
  const recoilTimer = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only shoot if left click and pointer is locked
      if (e.button !== 0 || !document.pointerLockElement) return;
      
      // Fire
      isRecoiling.current = true;
      recoilTimer.current = 0;
      onShoot();

      // Muzzle flash
      if (flashRef.current) {
        flashRef.current.intensity = 5;
        setTimeout(() => {
          if (flashRef.current) flashRef.current.intensity = 0;
        }, 50);
      }

      // Raycast to find hits
      raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);
      
      for (const hit of intersects) {
        // Traverse up the parent tree in case we hit a child mesh (like an arm or head)
        let currentObj: THREE.Object3D | null = hit.object;
        let foundEnemy = false;

        while (currentObj) {
          if (currentObj.userData && currentObj.userData.isEnemy) {
            currentObj.userData.takeDamage(50); // Weapon damage
            foundEnemy = true;
            break;
          }
          currentObj = currentObj.parent;
        }

        if (foundEnemy) break; // Stop ray at first enemy hit
        
        // If we hit something else (like a wall or obstacle), we stop the ray too.
        // But only if it's not a transparent/grid helper
        if (hit.object.type === 'Mesh') {
          break;
        }
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [camera, scene, onShoot]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Bobbing effect based on camera movement (optional, simple static position is fine too)
    // Here we just handle recoil animation
    if (isRecoiling.current) {
      recoilTimer.current += delta * 15;
      
      // Simple kickback
      const kick = Math.sin(recoilTimer.current) * 0.1;
      groupRef.current.position.z = -0.5 + kick;
      groupRef.current.position.y = -0.4 + (kick * 0.5);
      groupRef.current.rotation.x = kick * 0.5;

      if (recoilTimer.current > Math.PI) {
        isRecoiling.current = false;
        groupRef.current.position.z = -0.5;
        groupRef.current.position.y = -0.4;
        groupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0.3, -0.4, -0.5]}>
      {/* Weapon Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0, -0.25]}>
        <boxGeometry args={[0.04, 0.04, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      {/* Neon Accents */}
      <mesh position={[-0.05, 0, 0]}>
        <boxGeometry args={[0.01, 0.02, 0.3]} />
        <meshBasicMaterial color="#ee2222" />
      </mesh>
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[0.01, 0.02, 0.3]} />
        <meshBasicMaterial color="#ee2222" />
      </mesh>

      {/* Muzzle Flash Light */}
      <pointLight ref={flashRef} position={[0, 0, -0.4]} color="#ffcc33" intensity={0} distance={5} />
    </group>
  );
}
