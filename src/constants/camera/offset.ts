import { GAME_CONSTANTS } from "@/constants/game/board";
import { DEBUG_CONFIG } from "@/constants/debug/settings";
import type { CanvasProps } from "@react-three/fiber";
import { COLORS } from "@/config/colors/palette";

export const isMobile =
  window.innerWidth <= GAME_CONSTANTS.CAMERA.MOBILE_BREAKPOINT;

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
  position: isMobile
    ? GAME_CONSTANTS.CAMERA.POSITIONS.PERSPECTIVE.mobile.position
    : GAME_CONSTANTS.CAMERA.POSITIONS.PERSPECTIVE.position,
  rotation: GAME_CONSTANTS.CAMERA.POSITIONS.PERSPECTIVE.rotation,
};

export const canvasProps: CanvasProps = {
  orthographic: true,
  camera: {
    far: GAME_CONSTANTS.CAMERA.SETTINGS.far,
    near: GAME_CONSTANTS.CAMERA.SETTINGS.near,
  },
  gl: {
    precision: DEBUG_CONFIG.ENABLE_ANTIALIASING ? "highp" : "lowp",
    powerPreference: "high-performance",
    antialias: DEBUG_CONFIG.ENABLE_ANTIALIASING,
    alpha: true,
    depth: true,
  },
  style: {
    background: COLORS.terrain.grassUI,
    height: "100dvh",
    imageRendering: DEBUG_CONFIG.ENABLE_ANTIALIASING ? "auto" : "pixelated",
  },
};
