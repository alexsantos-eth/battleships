import { useMemo } from "react";

import { useGLTF } from "@react-three/drei";

import { ROCK_VARIANTS } from "./utils";

interface RockProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const Rock: React.FC<RockProps> = ({
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

export default Rock;
