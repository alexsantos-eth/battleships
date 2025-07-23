import { useRef } from "react";
import { createNoise2D } from "simplex-noise";

import { useFrame } from "@react-three/fiber";

import type { Mesh } from "three";

const noise = createNoise2D();

const WaterPlane = () => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    const mesh = meshRef.current;
    if (!mesh) return;

    const geometry = mesh.geometry;
    const position = geometry.attributes.position;

    const scale = 0.5;
    const amplitude = 0.1;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      const n = noise(x * scale + t, y * scale + t);
      position.setZ(i, n * amplitude);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]} position={[0, 0, 0.1]}>
      <planeGeometry args={[6, 6, 50, 50]} />
      <meshStandardMaterial
        color="#4aceff"
        roughness={0.6}
        metalness={0.4}
        flatShading
        emissive="#a6ffff"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

export default WaterPlane;
