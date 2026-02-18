// Constantes del juego
export const GAME_CONSTANTS = {
  SHIPS: {
    SIZES: {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    } as const,
    DEFAULT_COUNTS: {
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 1,
    } as const,
    MIN_DISTANCE: 2,
    MAX_PLACEMENT_ATTEMPTS: 200,
    MAX_GENERATION_ATTEMPTS: 1000,
  },
    GAME_LOGIC: {
    BATTLE: {
      DEFAULT_MAX_TURNS: 200,
      MAX_ATTEMPTS: 100,
      RANDOM_TURN_THRESHOLD: 0.5,
    },
    SHIP_GENERATION: {
      ORIENTATION_RANDOM_THRESHOLD: 0.5,
      QUADRANT_SIZE_DIVISOR: 2,
    },
  },
  BOARD: {
    DEFAULT_WIDTH: 10,
    DEFAULT_HEIGHT: 10,
    MIN_SIZE: 5,
    MAX_SIZE: 15,
    GRID_SPACING: 0.5,
    SHIP_SPACING: 0.5,
    ZOOM: {
      MOBILE: window.innerWidth * 0.17,
      DESKTOP: 120,
    },
    SCALE: [0.9, 0.9, 0.9] as [number, number, number],
    PLANE_GEOMETRY: {
      SEGMENTS: 10,
      MIN_SIZE: 5,
    },
    GRID_HELPER: {
      ROTATION: [-Math.PI / 2, 0, 0] as [number, number, number],
      POSITION: [0, 0, 0.21] as [number, number, number],
    },
  },
};
