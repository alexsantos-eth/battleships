import { useEffect, useRef, useState } from "react";

import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { eventBus, EVENTS } from "../utils/eventBus";

interface EnvironmentBoxProps {
  children: React.ReactNode;
}

const EnvironmentBox: React.FC<EnvironmentBoxProps> = ({ children }) => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const [rotationY, setRotationY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
  }, []);

  const rotateCamera = () => {
    if (cameraControlsRef.current) {
      const newRotation = rotationY === 0 ? Math.PI / 3 : 0;
      setRotationY(newRotation);

      const targetDistance =
        newRotation === 0 ? (isMobile ? 8 : 4) : isMobile ? 9 : 4.5;

      eventBus.emit(EVENTS.CAMERA_SHOOT_START, { newRotation, targetDistance });

      if (newRotation !== 0) {
        cameraControlsRef.current.rotate(-0.4, newRotation - rotationY, true);
      } else {
        cameraControlsRef.current.rotate(0.4, newRotation - rotationY, true);
      }

      cameraControlsRef.current.dollyTo(targetDistance, true);

      setTimeout(() => {
        eventBus.emit(EVENTS.CAMERA_SHOOT_END, { newRotation, targetDistance });
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

      <Canvas style={{ background: "white", height: "100dvh" }}>
        <ambientLight intensity={Math.PI * 0.55} color="white" />

        <directionalLight
          color="white"
          intensity={1}
          position={[0, 10, 0]}
          castShadow={false}
        />

        <CameraControls ref={cameraControlsRef} distance={isMobile ? 8 : 4} />

        {children}
      </Canvas>
    </div>
  );
};

export default EnvironmentBox;
