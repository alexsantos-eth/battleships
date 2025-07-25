import type { CanvasProps } from "@react-three/fiber";

export const isMobile = window.innerWidth <= 768;

export const PLAYER_CAMERA_POSITION = {
  position: [0, isMobile ? -4 : -6, 5],
  rotation: [isMobile ? 1.05 : 1.1, 0, 0],
};

export const cameraProps: CanvasProps = {
  orthographic: true,
  camera: {
    far: 1000,
    near: 0.5,
  },
  gl: {
    precision: "lowp",
    powerPreference: "high-performance",
    antialias: false,
  },
  style: { background: "white", height: "100dvh" },
};
