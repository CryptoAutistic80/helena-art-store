import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls, useTexture } from '@react-three/drei';
import { Suspense, useMemo } from 'react';

type Vec3 = [number, number, number];

const GalleryFrame = ({
  position,
  rotation,
  image,
  title,
  artist,
}: {
  position: Vec3;
  rotation: Vec3;
  image: string;
  title: string;
  artist: string;
}) => {
  const texture = useTexture(image);
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t / 8) * 6;
    camera.position.z = 8 + Math.cos(t / 6) * 3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.8} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[3.5, 2.2, 0.12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[3.2, 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <Html position={[0, -1.5, 0]} center>
        <div className="frame-label">
          <p>{title}</p>
          <span>{artist}</span>
        </div>
      </Html>
    </Float>
  );
};

const frames: Array<{ image: string; position: Vec3; rotation: Vec3; title: string; artist: string }> = [
  {
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
    position: [-4, 0.5, -2],
    rotation: [0, Math.PI / 6, 0],
    title: 'Luminescence in Motion',
    artist: 'Helena Mora',
  },
  {
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
    position: [0, 1.5, -4],
    rotation: [0, 0, 0],
    title: 'Spectral Symphony',
    artist: 'Jules Kei',
  },
  {
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    position: [4, 0.5, -2],
    rotation: [0, -Math.PI / 6, 0],
    title: 'Chromatic Drift',
    artist: 'Noemi Voss',
  },
];

const GalleryScene = () => {
  const points = useMemo(
    () =>
      Array.from({ length: 200 }, () => [
        (Math.random() - 0.5) * 20,
        Math.random() * 8,
        (Math.random() - 0.5) * 20,
      ] as Vec3),
    [],
  );

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1.2} color="#a855f7" />
      <pointLight position={[0, -4, -3]} intensity={0.7} color="#22d3ee" />

      {frames.map((frame) => (
        <GalleryFrame key={frame.title} {...frame} />
      ))}

      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#bae6fd" />
      </points>
    </group>
  );
};

export const ArtGalleryCanvas = () => (
  <Canvas className="gallery-canvas" camera={{ position: [0, 1, 10], fov: 45 }}>
    <color attach="background" args={[0.01, 0.04, 0.12]} />
    <Suspense fallback={null}>
      <GalleryScene />
    </Suspense>
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
  </Canvas>
);
