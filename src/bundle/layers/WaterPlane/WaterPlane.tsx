import React, { useRef } from "react";
import { createNoise2D } from "simplex-noise";

import { COLORS } from "@/config/colors/palette";
import { useFrame } from "@react-three/fiber";

import type { Mesh } from "three";
import type { WaterPlaneProps, WaterAnimationConfig } from "./WaterPlane.types";

const noise = createNoise2D();

export const WaterPlane: React.FC<WaterPlaneProps> = ({
  size = [8, 8],
  segments = [25, 25],
  position = [0, 0, 0.1],
  rotation = [0, 0, 0],
  amplitude = 0.1,
  speed = 0.2,
  scale = 0.5,
}) => {
  const meshRef = useRef<Mesh>(null!);

  const animationConfig: WaterAnimationConfig = {
    scale,
    amplitude,
    speed,
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * animationConfig.speed;
    const mesh = meshRef.current;
    if (!mesh) return;

    const geometry = mesh.geometry;
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      const n = noise(
        x * animationConfig.scale + t,
        y * animationConfig.scale + t
      );
      position.setZ(i, n * animationConfig.amplitude);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={rotation} position={position}>
      <planeGeometry args={[...size, ...segments]} />
      <meshStandardMaterial
        color={COLORS.water.primary}
        roughness={0.5}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
};
