import { useCameraEvents } from "@/hooks/useCameraEvents";

const CameraController = () => {
  useCameraEvents({
    animationSpeed: 0.1, // Aumentado de 0.12 a 0.18 para transiciones más rápidas
    enableLOD: false, // Deshabilitar LOD para mantener máxima calidad
  });

  return null;
};

export default CameraController;
