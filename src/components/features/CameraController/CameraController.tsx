import React from "react";
import { useCameraEvents } from "@/hooks/useCameraEvents";
import type { CameraControllerProps, CameraOptions } from './CameraController.types';

export const CameraController: React.FC<CameraControllerProps> = () => {
  const cameraOptions: CameraOptions = {
    animationSpeed: 0.1,
    enableLOD: false,
  };
  
  useCameraEvents(cameraOptions);

  return null;
}; 