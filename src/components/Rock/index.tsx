import { useMemo } from "react";

import { useGLTF } from "@react-three/drei";

import { ROCK_VARIANTS } from "./utils";

interface RockProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const Rock: React.FC<RockProps> = ({
  variant,
  position,
  rotation = [0, 0, 0],
  scale,
}) => {
  const { scene } = useGLTF(ROCK_VARIANTS[variant]);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const defaultScale = useMemo(() => {
    if (variant >= 6 && variant <= 9) {
      return [0.3, 0.3, 0.3] as [number, number, number];
    }

    return [1, 1, 1] as [number, number, number];
  }, [variant]);

  const finalScale = scale || defaultScale;

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={finalScale}
    />
  );
};

export default Rock;
