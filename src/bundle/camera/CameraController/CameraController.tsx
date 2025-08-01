import React from "react";

import { useCameraEvents } from "@/bundle/hooks/camera/useCameraEvents";

import type {
  CameraControllerProps,
  CameraOptions,
} from "./CameraController.types";
import { GAME_CONSTANTS } from "@/constants/game/board";
export const CameraController: React.FC<CameraControllerProps> = () => {
  const cameraOptions: CameraOptions = {
    animationSpeed: GAME_CONSTANTS.CAMERA.SETTINGS.animationSpeed,
    enableLOD: false,
  };

  useCameraEvents(cameraOptions);

  return null;
};
