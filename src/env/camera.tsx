import { useLocation } from "react-router-dom";

import { usePlaygroundStore } from "@/stores/playgroundStore";
import { DEBUG_CONFIG } from "@/utils/debug";
import { OrbitControls } from "@react-three/drei";

const Camera = () => {
  const location = useLocation();
  const isPlaygroundRoute = location.pathname === "/playground";
  const { freeCameraMovement } = usePlaygroundStore();

  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS || !isPlaygroundRoute) {
    return null;
  }

  return (
    <>
      <OrbitControls
        onChange={() => {}}
        onStart={() => {}}
        onEnd={() => {}}
        enablePan={isPlaygroundRoute && freeCameraMovement}
        enableZoom={isPlaygroundRoute && freeCameraMovement}
        enableRotate={isPlaygroundRoute && freeCameraMovement}
        maxDistance={isPlaygroundRoute && freeCameraMovement ? 50 : 20}
        minDistance={isPlaygroundRoute && freeCameraMovement ? 1 : 5}
        maxPolarAngle={
          isPlaygroundRoute && freeCameraMovement ? Math.PI : Math.PI / 2
        }
        minPolarAngle={isPlaygroundRoute && freeCameraMovement ? 0 : 0}
      />
    </>
  );
};

export default Camera;
