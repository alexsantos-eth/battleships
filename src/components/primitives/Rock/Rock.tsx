import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { ROCK_VARIANTS } from "./utils";
import type { RockProps } from './Rock.types';

export const Rock: React.FC<RockProps> = ({
  variant,
  position,
  rotation = [0, 0, 0],
  scale = [1.2, 1.2, 1.2],
}) => {
  const { scene } = useGLTF(ROCK_VARIANTS[variant]);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}; 