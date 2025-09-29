import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

interface GlowOrbProps {
  color: string;
  position: [number, number, number];
  scale: number;
  floatSpeed: number;
}

export function GlowOrb({ color, position, scale, floatSpeed }: GlowOrbProps) {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;

    const t = state.clock.elapsedTime * floatSpeed;
    mesh.current.position.y = position[1] + Math.sin(t) * 0.4;
    mesh.current.rotation.y += 0.0015;
    mesh.current.rotation.x += 0.001;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
    </mesh>
  );
}
