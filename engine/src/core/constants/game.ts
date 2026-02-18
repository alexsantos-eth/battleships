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
  },
  GAME_LOGIC: {
    BATTLE: {
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
    MIN_SIZE: 3,
    MAX_SIZE: 30,
  },
};
