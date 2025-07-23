import { useMemo } from "react";

import { useGLTF } from "@react-three/drei";

import { useCameraShootStart } from "../../hooks/useCameraEvents";

interface CannonProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  id?: string;
}

const Cannon: React.FC<CannonProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
  id = "default",
}) => {
  const { scene } = useGLTF("/assets/models/Prop_Cannon.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useCameraShootStart((data) => {
    console.log(`Cannon ${id} received camera shoot event:`, data);
  });

  return (
    <group rotation={[Math.PI / 2, -Math.PI / 2, 0]} position={[0, 0, 0.6]}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </group>
  );
};

export default Cannon;
