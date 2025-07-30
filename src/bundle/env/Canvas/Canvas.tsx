import { CameraController } from "@/bundle/camera/CameraController";
import useCanvasProps from "@/bundle/env/Canvas/hooks/props/useCanvasProps";
import { Canvas } from "@react-three/fiber";

import CameraControls from "../Controls/Controls";
import Lights from "../Lights/Lights";

import type { EnvironmentBoxProps } from "./Canvas.type";

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  const canvasProps = useCanvasProps();

  return (
    <div style={{ position: "relative" }}>
      <Canvas {...canvasProps}>
        <CameraController />
        <CameraControls />
        <Lights />
        {children}
      </Canvas>
    </div>
  );
};

export default EnvironmentBox;
