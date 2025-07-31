import { useEffect, useState } from "react";

import {
  canvasProps,
  isMobile as mobileBreakpoint,
  PLAYER_CAMERA_POSITION,
} from "@/constants/camera/offset";
import { DEBUG_CONFIG } from "@/constants/debug/settings";

import type { CanvasProps } from "@react-three/fiber";

const useCanvasProps = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(mobileBreakpoint);
    };

    checkMobile();
  }, []);

  const baseProps = {
    ...canvasProps,
    camera: {
      ...canvasProps.camera,
      zoom: isMobile ? window.innerWidth * 0.13: 110,
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

export default useCanvasProps;
