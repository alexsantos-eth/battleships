import { useGLTF } from "@react-three/drei";

import { HOUSE_VARIANTS } from "./constants/variants";

import type { HouseProps } from "./House.types";
const House: React.FC<HouseProps> = ({
  variant,
  position,
  rotation,
  scale,
}) => {
  const { scene } = useGLTF(HOUSE_VARIANTS[variant]);
  const clonedScene = scene.clone();

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default House;
