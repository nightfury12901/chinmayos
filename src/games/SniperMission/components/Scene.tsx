import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { World } from './World';
import { Enemies } from './Enemies';
import { Weapon } from './Weapon';
import { PerspectiveCamera } from '@react-three/drei';

interface SceneProps {
  level: number;
  onScore: (points: number) => void;
  onDamage: (dmg: number) => void;
  onLevelComplete: () => void;
}

export function Scene({ level, onScore, onDamage, onLevelComplete }: SceneProps) {
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/sniper_city.png')" }}
    >
      <Canvas shadows gl={{ antialias: false, alpha: true }}>
        {/* 
          We use a perspective camera wrapped with Drei's helper to easily attach children. 
          The Player component will use PointerLockControls to move it.
        */}
        <PerspectiveCamera makeDefault fov={75} position={[0, 2, 0]}>
          <Weapon onShoot={() => {}} />
        </PerspectiveCamera>
        
        <Player />
        {/* We disable the original World to show the 2D background, but keep enemies */}
        {/* <World /> */}
        
        {/* Basic lighting for enemies */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <Enemies 
          level={level} 
          onScore={onScore} 
          onDamage={onDamage} 
          onLevelComplete={onLevelComplete} 
        />
      </Canvas>
    </div>
  );
}
