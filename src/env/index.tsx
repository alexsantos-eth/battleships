import { useEffect, useRef, useState } from "react";

import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { eventBus, EVENTS } from "../utils/eventBus";

interface EnvironmentBoxProps {
  children: React.ReactNode;
}

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
  }, []);

  const rotateCamera = () => {
    if (cameraControlsRef.current) {
      eventBus.emit(EVENTS.CAMERA_SHOOT_START, {});

      setTimeout(() => {
        eventBus.emit(EVENTS.CAMERA_SHOOT_END, {});
      }, 1000);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={rotateCamera}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Disparar
      </button>

      <Canvas
        orthographic
        camera={{
          zoom: isMobile ? window.innerWidth * 0.2 : 140,
          far: 1000,
        }}
        style={{ background: "white", height: "100dvh" }}
      >
        <ambientLight intensity={Math.PI * 0.55} color="white" />

        <directionalLight
          color="white"
          intensity={1}
          position={[0, 10, 0]}
          castShadow={false}
        />

        <CameraControls ref={cameraControlsRef} />

        {children}
      </Canvas>
    </div>
  );
};

export default EnvironmentBox;
