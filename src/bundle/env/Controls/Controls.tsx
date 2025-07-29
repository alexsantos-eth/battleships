import { useLocation } from "react-router-dom";

import { DEBUG_CONFIG } from "@/constants/debug/settings";
import { OrbitControls } from "@react-three/drei";

const CameraControls = () => {
  const location = useLocation();
  const isPlaygroundRoute = location.pathname === "/playground";

  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS || !isPlaygroundRoute) {
    return null;
  }

  return (
    <>
      <OrbitControls
        onChange={() => {}}
        onStart={() => {}}
        onEnd={() => {}}
        enablePan={isPlaygroundRoute}
        enableZoom={isPlaygroundRoute}
        enableRotate={isPlaygroundRoute}
        maxDistance={isPlaygroundRoute ? 50 : 20}
        minDistance={isPlaygroundRoute ? 1 : 5}
        maxPolarAngle={isPlaygroundRoute ? Math.PI : Math.PI / 2}
        minPolarAngle={isPlaygroundRoute ? 0 : 0}
      />
    </>
  );
};

export default CameraControls;
