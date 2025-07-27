import { useLocation } from "react-router-dom";

import { useTestingStore } from "@/stores/testingStore";
import { DEBUG_CONFIG } from "@/utils/debug";
import { OrbitControls } from "@react-three/drei";

const Camera = () => {
  const location = useLocation();
  const isTestingRoute = location.pathname === "/testing";
  const { freeCameraMovement } = useTestingStore();

  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
    return null;
  }

  return (
    <>
      <OrbitControls
        onChange={() => {}}
        onStart={() => {}}
        onEnd={() => {}}
        enablePan={isTestingRoute && freeCameraMovement}
        enableZoom={isTestingRoute && freeCameraMovement}
        enableRotate={isTestingRoute && freeCameraMovement}
        maxDistance={isTestingRoute && freeCameraMovement ? 50 : 20}
        minDistance={isTestingRoute && freeCameraMovement ? 1 : 5}
        maxPolarAngle={
          isTestingRoute && freeCameraMovement ? Math.PI : Math.PI / 2
        }
        minPolarAngle={isTestingRoute && freeCameraMovement ? 0 : 0}
      />
    </>
  );
};

export default Camera;
