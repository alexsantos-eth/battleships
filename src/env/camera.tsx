import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { DEBUG_CONFIG } from "../utils/debug";

const Camera = () => {
  const { camera } = useThree();

  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
    return null;
  }

  return (
    <OrbitControls
      onChange={() => {
        console.log("OrbitControls onChange:", camera.position);
        console.log("OrbitControls onChange:", camera.rotation);
      }}
      onStart={() => {
        console.log("OrbitControls started moving");
      }}
      onEnd={() => {
        console.log("OrbitControls stopped moving");
      }}
    />
  );
};

export default Camera;
