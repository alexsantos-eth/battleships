import { CameraController } from "@/components/features/CameraController";
import useCameraProps from "@/hooks/useCameraProps";
import { Canvas } from "@react-three/fiber";

import Camera from "./camera";
import Lights from "./lights";

interface EnvironmentBoxProps {
  children: React.ReactNode;
}

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  const cameraProps = useCameraProps();

  return (
    <div style={{ position: "relative" }}>
      <Canvas {...cameraProps}>
        <CameraController />
        <Lights />
        <Camera />
        {children}
      </Canvas>
    </div>
  );
};

export default EnvironmentBox;
