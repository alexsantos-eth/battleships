import type { CanvasProps } from "@react-three/fiber";

export const isMobile = window.innerWidth <= 768;

export const PLAYER_CAMERA_POSITION = {
  position: [0, isMobile ? -2 : -4, 4], // Ajustado para balancear con la posición enemiga
  rotation: [isMobile ? 1.05 : 1.1, 0, 0],
};

export const ENEMY_CAMERA_POSITION = {
  position: [0, 9, 4], // Bajado de 7 a 5 para que el tablero no quede tan arriba
  rotation: [0, 0, 0],
};

export const PLAYER_PERSPECTIVE_POSITION = {
  position: [0, 0, 6], // Ajustado para mejor vista del tablero
  rotation: [0, 0, 0],
};

export const cameraProps: CanvasProps = {
  orthographic: true,
  camera: {
    far: 1500,
    near: 0.5,
  },
  gl: {
    precision: "lowp", // Cambiar de lowp a mediump para mejor calidad
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
