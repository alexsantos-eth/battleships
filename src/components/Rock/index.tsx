import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

interface RockProps {
  variant: 1 | 2 | 3 | 4 | 5;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const ROCK_VARIANTS = {
  1: "/src/assets/models/Environment_Rock_1.gltf",
  2: "/src/assets/models/Environment_Rock_2.gltf",
  3: "/src/assets/models/Environment_Rock_3.gltf",
  4: "/src/assets/models/Environment_Rock_4.gltf",
  5: "/src/assets/models/Environment_Rock_5.gltf",
} as const;

const Rock: React.FC<RockProps> = ({ 
  variant, 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1] 
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
