import { useMemo } from "react";

import { useGLTF } from "@react-three/drei";

interface PalmTreeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  variant?: 1 | 2 | 3;
}

const PalmTree: React.FC<PalmTreeProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = [0.7, 0.7, 0.7],
  variant = 1,
}) => {
  const { scene } = useGLTF(
    `/assets/models/Tree${variant}.glb`
  );
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

export default PalmTree;
