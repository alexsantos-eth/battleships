import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface EnvironmentBoxProps {
  children: React.ReactNode;
}

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  return (
    <Canvas style={{ background: "white" }}>
      <ambientLight intensity={Math.PI / 2} color="white" />

      <directionalLight
        color="white"
        intensity={1}
        position={[0, 10, 0]}
        castShadow={false}
      />

      <CameraControls />

      {children}
    </Canvas>
  );
};

export default EnvironmentBox;
