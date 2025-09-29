import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { GlowOrb } from './glow-orb';

export function HeroCanvas() {
  return (
    <Canvas className="h-[420px] w-full" dpr={[1, 1.5]}>
      <color attach="background" args={[0, 0, 0]} />
      <PerspectiveCamera makeDefault position={[0, 1.5, 6]} fov={55} />
      <ambientLight intensity={0.6} />
      <spotLight
        position={[4, 8, 5]}
        angle={0.8}
        intensity={1.2}
        penumbra={0.5}
        castShadow
      />
      <Stars depth={40} radius={80} count={4000} factor={4} saturation={0} fade />
      <GlowOrb color="#8a5cf6" position={[-1.8, 0.2, 0]} scale={1.6} floatSpeed={0.8} />
      <GlowOrb color="#f672ff" position={[1.6, 0.4, -0.5]} scale={1.2} floatSpeed={1.1} />
      <GlowOrb color="#4ade80" position={[0, -0.4, 0.8]} scale={0.9} floatSpeed={1.35} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
