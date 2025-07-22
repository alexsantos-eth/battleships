import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface EnvironmentBoxProps {
  children: React.ReactNode;
}

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  return (
    <Canvas style={{ background: "white" }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[0, 4, 15]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI / 2}
      />

      <CameraControls />

      {children}
    </Canvas>
  );
};

export default EnvironmentBox;
