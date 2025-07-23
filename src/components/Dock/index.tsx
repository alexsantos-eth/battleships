import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

interface DockProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const Dock: React.FC<DockProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = [0.3, 0.3, 0.3],
}) => {
  const { scene } = useGLTF("/assets/models/Environment_Dock.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group rotation={[Math.PI / 2, Math.PI/2, 0]} position={[0, 0, 0.6]}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </group>
  );
};

export default Dock;
