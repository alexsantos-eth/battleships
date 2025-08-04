import React from "react";

import { useGLTF } from "@react-three/drei";

import { ROCK_VARIANTS } from "./constants/variants";

import type { RockProps } from "./Rock.types";

export const Rock: React.FC<RockProps> = ({
  variant,
  position,
  rotation = [0, 0, 0],
  scale = [1.2, 1.2, 1.2],
}) => {
  const { scene } = useGLTF(ROCK_VARIANTS[variant]);

  const clonedScene = scene.clone();
  scene?.traverse((o) => (o.castShadow = true));

  return (
    <mesh>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </mesh>
  );
};
