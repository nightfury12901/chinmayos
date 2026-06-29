import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyProps {
  position: [number, number, number];
  onDefeat: () => void;
  onAttack: () => void;
  speed: number;
}

function Enemy({ position, onDefeat, onAttack, speed }: EnemyProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Body parts for animation
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  
  const { camera } = useThree();
  const [health, setHealth] = useState(100);
  const [isDead, setIsDead] = useState(false);
  
  const lastAttack = useRef(0);
  const walkCycle = useRef(0);

  // Materials
  const mainMat = new THREE.MeshStandardMaterial({ color: '#ffcc33', roughness: 0.5 });
  const visorMat = new THREE.MeshBasicMaterial({ color: '#ee2222' });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#222222' });

  useFrame(({ clock }) => {
    if (!groupRef.current || isDead) return;

    const enemy = groupRef.current;
    
    // Look at player (Y level clamped so it doesn't tilt)
    const targetPos = new THREE.Vector3(camera.position.x, enemy.position.y, camera.position.z);
    enemy.lookAt(targetPos);

    const distance = enemy.position.distanceTo(targetPos);
    
    if (distance > 2) {
      // Move forward
      enemy.translateZ(speed * 0.016);
      
      // Walk animation
      walkCycle.current += speed * 0.05;
      const legAngle = Math.sin(walkCycle.current) * 0.5;
      
      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -legAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = legAngle;
    } else {
      // Attack if close enough
      const now = clock.getElapsedTime();
      if (now - lastAttack.current > 1.5) {
        lastAttack.current = now;
        onAttack();
        
        // Attack animation: swing arms up
        if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI / 2;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI / 2;
        setTimeout(() => {
          if (!isDead && leftArmRef.current) leftArmRef.current.rotation.x = 0;
          if (!isDead && rightArmRef.current) rightArmRef.current.rotation.x = 0;
        }, 200);
      }
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData = { 
        isEnemy: true,
        takeDamage: (dmg: number) => {
          setHealth(h => h - dmg);
          // Flash effect
          if (groupRef.current) {
            groupRef.current.position.y += 0.2; // slight knockback/jump
            setTimeout(() => {
              if (groupRef.current && !isDead) groupRef.current.position.y -= 0.2;
            }, 100);
          }
        }
      };
    }
  }, [isDead]);

  useEffect(() => {
    if (health <= 0 && !isDead) {
      setIsDead(true);
      onDefeat();
    }
  }, [health, isDead, onDefeat]);

  if (isDead) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <primitive object={mainMat} attach="material" />
        {/* Visor */}
        <mesh position={[0, 0.1, 0.41]}>
          <planeGeometry args={[0.6, 0.2]} />
          <primitive object={visorMat} attach="material" />
        </mesh>
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1, 1.4, 0.5]} />
        <primitive object={mainMat} attach="material" />
      </mesh>

      {/* Left Arm (Pivot at shoulder) */}
      <group position={[-0.7, 1.2, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
      </group>

      {/* Right Arm (Pivot at shoulder) */}
      <group position={[0.7, 1.2, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
      </group>

      {/* Left Leg (Pivot at hip) */}
      <group position={[-0.3, 0, 0]} ref={leftLegRef}>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.4, 1.4, 0.4]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
      </group>

      {/* Right Leg (Pivot at hip) */}
      <group position={[0.3, 0, 0]} ref={rightLegRef}>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.4, 1.4, 0.4]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

interface EnemiesProps {
  level: number;
  onScore: (points: number) => void;
  onDamage: (dmg: number) => void;
  onLevelComplete: () => void;
}

interface EnemyData {
  id: string;
  pos: [number, number, number];
  speed: number;
}

export function Enemies({ level, onScore, onDamage, onLevelComplete }: EnemiesProps) {
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const enemiesLeftToDefeat = useRef(0);

  useEffect(() => {
    const numEnemies = level * 2 + 1;
    enemiesLeftToDefeat.current = numEnemies;
    
    const newEnemies: EnemyData[] = [];
    for (let i = 0; i < numEnemies; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      newEnemies.push({
        id: `enemy-${level}-${i}`,
        pos: [x, 1.4, z], // 1.4 pushes legs flush with ground
        speed: 3 + (level * 0.5) + (Math.random() * 2),
      });
    }
    setEnemies(newEnemies);
  }, [level]);

  const handleDefeat = (id: string) => {
    setEnemies(prev => prev.filter(e => e.id !== id));
    onScore(100);
    enemiesLeftToDefeat.current--;
    
    if (enemiesLeftToDefeat.current <= 0) {
      setTimeout(onLevelComplete, 1000);
    }
  };

  return (
    <group>
      {enemies.map(e => (
        <Enemy 
          key={e.id} 
          position={e.pos} 
          speed={e.speed}
          onDefeat={() => handleDefeat(e.id)} 
          onAttack={() => onDamage(15 + level * 2)}
        />
      ))}
    </group>
  );
}
