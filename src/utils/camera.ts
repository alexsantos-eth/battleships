import type { CanvasProps } from "@react-three/fiber";
import { GAME_CONSTANTS } from './constants';

export const isMobile = window.innerWidth <= GAME_CONSTANTS.CAMERA.MOBILE_BREAKPOINT;

export const PLAYER_CAMERA_POSITION = {
  position: isMobile 
    ? GAME_CONSTANTS.CAMERA.POSITIONS.PLAYER.mobile.position 
    : GAME_CONSTANTS.CAMERA.POSITIONS.PLAYER.position,
  rotation: isMobile 
    ? GAME_CONSTANTS.CAMERA.POSITIONS.PLAYER.mobile.rotation 
    : GAME_CONSTANTS.CAMERA.POSITIONS.PLAYER.rotation,
};

export const ENEMY_CAMERA_POSITION = {
  position: GAME_CONSTANTS.CAMERA.POSITIONS.ENEMY.position,
  rotation: GAME_CONSTANTS.CAMERA.POSITIONS.ENEMY.rotation,
};

export const PLAYER_PERSPECTIVE_POSITION = {
  position: GAME_CONSTANTS.CAMERA.POSITIONS.PERSPECTIVE.position,
  rotation: GAME_CONSTANTS.CAMERA.POSITIONS.PERSPECTIVE.rotation,
};

export const cameraProps: CanvasProps = {
  orthographic: true,
  camera: {
    far: GAME_CONSTANTS.CAMERA.SETTINGS.far,
    near: GAME_CONSTANTS.CAMERA.SETTINGS.near,
  },
  gl: {
    precision: "lowp",
    powerPreference: "high-performance",
    antialias: false,
    alpha: false,
    depth: true,
    stencil: false,
    preserveDrawingBuffer: false,
    logarithmicDepthBuffer: false,
  },
  style: { background: "white", height: "100dvh" },
};
