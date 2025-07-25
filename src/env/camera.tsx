import { DEBUG_CONFIG } from "@/utils/debug";
import { OrbitControls } from "@react-three/drei";

const Camera = () => {
  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
    return null;
  }

  return (
    <OrbitControls onChange={() => {}} onStart={() => {}} onEnd={() => {}} />
  );
};

export default Camera;
