import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { TreeProps } from './Tree.types';

export const Tree: React.FC<TreeProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = [0.7, 0.7, 0.7],
  variant = 1,
}) => {
  const { scene } = useGLTF(`/assets/models/Tree${variant}.glb`);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}; 