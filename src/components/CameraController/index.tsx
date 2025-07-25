import { useCameraEvents } from "@/hooks/useCameraEvents";

const CameraController = () => {
  useCameraEvents({
    animationSpeed: 0.07,
  });

  return null;
};

export default CameraController;
