import { DEBUG_CONFIG } from "@/constants/debug/settings";
import { OrbitControls } from "@react-three/drei";

const CameraControls = () => {
  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
    return null;
  }

  return (
    <>
      <OrbitControls onChange={() => {}} onStart={() => {}} onEnd={() => {}} />
    </>
  );
};

export default CameraControls;
