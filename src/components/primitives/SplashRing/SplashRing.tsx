import React, { useRef } from "react";
import { Mesh } from "three";
import { COLORS } from "@/config/colors";
import { a, useSpring } from "@react-spring/three";
import type { SplashRingProps } from './SplashRing.types';

export const SplashRing: React.FC<SplashRingProps> = ({ position, onDone }) => {
  const mesh = useRef<Mesh>(null!);

  const { scale, opacity } = useSpring({
    from: { scale: 0.2, opacity: 1 },
    to: { scale: 1.2, opacity: 0 },
    config: { duration: 400 },
    onRest: onDone,
  });

  return (
    <a.mesh
      ref={mesh}
      position={[position[0], position[1], 0.3]}
      rotation={[0, 0, 0]}
      scale={scale}
    >
      <ringGeometry args={[0.2, 0.25, 32]} />
      <a.meshBasicMaterial
        color={COLORS.water.splash}
        transparent
        opacity={opacity}
      />
    </a.mesh>
  );
}; 