import { Canvas } from "@react-three/fiber";

import CameraController from "../components/CameraController";
import useCameraProps from "../hooks/useCameraProps";
import UIBox from "../ui";
import Camera from "./camera";
import Lights from "./lights";

interface EnvironmentBoxProps {
  children: React.ReactNode;
}

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  const cameraProps = useCameraProps();

  return (
    <div style={{ position: "relative" }}>
      <UIBox />
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
