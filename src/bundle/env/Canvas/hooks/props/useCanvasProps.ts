/* eslint-disable @typescript-eslint/no-empty-object-type */
import { useEffect, useState } from 'react';
import * as THREE from 'three/webgpu';

import {
    canvasProps, isMobile as mobileBreakpoint, PLAYER_CAMERA_POSITION
} from '@/constants/camera/offset';
import { DEBUG_CONFIG } from '@/constants/debug/settings';
import { GAME_CONSTANTS } from '@/constants/game/board';
import { type CanvasProps, extend, type ThreeToJSXElements } from '@react-three/fiber';

import type {
  WebGPURendererParameters,
} from 'three/src/renderers/webgpu/WebGPURenderer.js';
declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as unknown as Record<string, new () => THREE.Object3D>);

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
     gl: async (props) => {
      const renderer = new THREE.WebGPURenderer(props as unknown as WebGPURendererParameters);
      await renderer.init()
      return renderer
    },
    camera: {
      ...canvasProps.camera,
      zoom: isMobile
        ? GAME_CONSTANTS.BOARD.ZOOM.MOBILE
        : GAME_CONSTANTS.BOARD.ZOOM.DESKTOP,
    },
  } as CanvasProps;

  if (!DEBUG_CONFIG.GET_ENABLE_CAMERA_CONTROLS()) {
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
