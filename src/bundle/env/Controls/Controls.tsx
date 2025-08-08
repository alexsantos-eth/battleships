import { DEBUG_CONFIG } from "@/constants/debug/settings";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const CameraControls = () => {
  const { camera } = useThree();

  if (!DEBUG_CONFIG.GET_ENABLE_CAMERA_CONTROLS()) {
    return null;
  }

  return (
    <>
      <OrbitControls
        onChange={() => {
          console.log({ camera });
        }}
        onStart={() => {}}
        onEnd={() => {}}
      />
    </>
  );
};

export default CameraControls;
