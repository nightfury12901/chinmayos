import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const SPEED = 12;
const BOUNDS = 24; // Arena is 50x50, from -25 to 25. Limit to 24 to keep player inside.

export function Player() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Input state
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const onKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 2, 0); // Player eye height is 2
  }, [camera]);

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    // Movement calculation
    const inputX = (keys.current['KeyD'] ? 1 : 0) - (keys.current['KeyA'] ? 1 : 0);
    const inputZ = (keys.current['KeyS'] ? 1 : 0) - (keys.current['KeyW'] ? 1 : 0);

    direction.current.set(inputX, 0, inputZ).normalize();

    // Damping / Friction
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    // Acceleration
    if (inputX !== 0) velocity.current.x += direction.current.x * SPEED * delta;
    if (inputZ !== 0) velocity.current.z += direction.current.z * SPEED * delta;

    // Apply movement relative to camera look direction
    controlsRef.current.moveRight(velocity.current.x);
    controlsRef.current.moveForward(-velocity.current.z);

    // Collision (Bounding Box) clamp
    if (camera.position.x > BOUNDS) camera.position.x = BOUNDS;
    if (camera.position.x < -BOUNDS) camera.position.x = -BOUNDS;
    if (camera.position.z > BOUNDS) camera.position.z = BOUNDS;
    if (camera.position.z < -BOUNDS) camera.position.z = -BOUNDS;
    camera.position.y = 2; // Lock height
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
    </>
  );
}
