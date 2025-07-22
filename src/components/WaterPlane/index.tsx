import { useRef } from "react";

import { useFrame } from "@react-three/fiber";

import type { Mesh } from "three";

const WaterPlane = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mesh = meshRef.current;
    if (!mesh) return;

    const geometry = mesh.geometry;
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const wave = Math.sin(x * 2 + t * 2) * Math.cos(y * 2 + t) * 0.1;
      position.setZ(i, wave);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]} position={[0, 0, 0.1]}>
      <planeGeometry args={[5, 5, 10, 10]} />
      <meshPhysicalMaterial color="#3399ff" flatShading />
    </mesh>
  );
};

export default WaterPlane;
