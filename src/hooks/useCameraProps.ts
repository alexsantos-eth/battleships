import { useEffect, useState } from "react";

import {
  cameraProps,
  isMobile as mobileBreakpoint,
  PLAYER_CAMERA_POSITION,
} from "@/utils/camera";
import { DEBUG_CONFIG } from "@/utils/debug";

import type { CanvasProps } from "@react-three/fiber";

const useCameraProps = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(mobileBreakpoint);
    };

    checkMobile();
  }, []);

  const baseProps = {
    ...cameraProps,
    camera: {
      ...cameraProps.camera,
      zoom: isMobile ? window.innerWidth * 0.19 : 140,
    },
  };

  if (!DEBUG_CONFIG.ENABLE_CAMERA_CONTROLS) {
    return {
      ...baseProps,
      camera: {
        ...baseProps.camera,
        position: PLAYER_CAMERA_POSITION.position,
        rotation: PLAYER_CAMERA_POSITION.rotation,
      },
    } as CanvasProps;
  }

  return baseProps as CanvasProps;
};

export default useCameraProps;
