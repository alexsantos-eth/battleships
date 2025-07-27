import { useCameraEvents } from "@/hooks/useCameraEvents";

const CameraController = () => {
  const cameraOptions = {
    animationSpeed: 0.1,
    enableLOD: false,
  };
  useCameraEvents(cameraOptions);

  return null;
};

export default CameraController;
