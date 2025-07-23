import { useMemo } from "react";

import { useGLTF } from "@react-three/drei";

interface RockProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const ROCK_VARIANTS = {
  1: "/assets/models/Environment_Rock_1.gltf",
  2: "/assets/models/Environment_Rock_2.gltf",
  3: "/assets/models/Environment_Rock_3.gltf",
  4: "/assets/models/Environment_Rock_4.gltf",
  5: "/assets/models/Environment_Rock_5.gltf",
  6: "/assets/models/Environment_Cliff1.gltf",
  7: "/assets/models/Environment_Cliff2.gltf",
  8: "/assets/models/Environment_Cliff3.gltf",
  9: "/assets/models/Environment_Cliff4.gltf",
} as const;

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
      return [0.2, 0.2, 0.2] as [number, number, number];
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
