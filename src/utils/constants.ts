export const GAME_CONSTANTS = {
  BOARD: {
    DEFAULT_WIDTH: 10,
    DEFAULT_HEIGHT: 10,
    MIN_SIZE: 5,
    MAX_SIZE: 15,
    GRID_SPACING: 0.5,
    SHIP_SPACING: 0.5,
  },

  SHIPS: {
    SIZES: {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    },
    DEFAULT_COUNTS: {
      small: 4,
      medium: 3,
      large: 2,
      xlarge: 1,
    },
    MIN_DISTANCE: 2,
    MAX_PLACEMENT_ATTEMPTS: 200,
    MAX_GENERATION_ATTEMPTS: 1000,
  },

  CAMERA: {
    MOBILE_BREAKPOINT: 768,
    POSITIONS: {
      PLAYER: {
        position: [0, -4, 4] as [number, number, number],
        rotation: [1.1, 0, 0] as [number, number, number],
        mobile: {
          position: [0, -2, 4] as [number, number, number],
          rotation: [1.05, 0, 0] as [number, number, number],
        },
      },
      ENEMY: {
        position: [0, 9, 4] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
      },
      PERSPECTIVE: {
        position: [0, 0, 6] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
      },
    },
    SETTINGS: {
      far: 1500,
      near: 0.5,
      animationSpeed: 0.15,
      eventThrottleMs: 16,
      animationThrottleMs: 8,
      positionThreshold: 0.00001,
      rotationThreshold: 0.005,
    },
    PERFORMANCE: {
      slowDeviceCores: 4,
      pixelRatioReduction: 0.8,
      fpsWarningThreshold: 20,
      ratioReductionFactor: 0.9,
    },
  },

  ANIMATIONS: {
    DROPLET: {
      distance: 0.5,
      startZ: 0.15,
      endZ: 0.5,
      startOpacity: 1,
      endOpacity: 0,
      duration: 400,
      count: 10,
    },
    SHOT: {
      defaultDelay: 500,
      hitDelay: 1000,
      missDelay: 600,
      visualHitDelay: 1200,
      visualMissDelay: 800,
    },
    WAVE: {
      frequencyMultiplier: 0.7,
      amplitudeMultiplier: 0.5,
      phaseMultiplier: 0.5,
    },
  },

  PERFORMANCE: {
    TARGET_FPS: 60,
    DEFAULT_FPS: 60,
    DEFAULT_RENDER_TIME: 16,
    LOW_PERFORMANCE_THRESHOLD: 0.8,
    MEMORY: {
      DEFAULT_USED: 100 * 1024 * 1024,
      DEFAULT_TOTAL: 512 * 1024 * 1024,
      WARNING_THRESHOLD: 80,
    },
    CPU: {
      BASE_USAGE: 5,
      MAX_USAGE: 30,
      ACTIVITY_BONUS: 20,
      VARIATION: 2,
      WARNING_THRESHOLD: 70,
    },
    SYSTEM: {
      UPDATE_INTERVAL: 2000,
      ACTIVITY_TIMEOUT: 1000,
      FRAME_RATE_DIVISOR: 10,
      BYTES_BASE: 1024,
    },
  },

  UI: {
    POSITIONS: {
      TOP_LEFT: "top-left",
      TOP_RIGHT: "top-right",
      BOTTOM_LEFT: "bottom-left",
      BOTTOM_RIGHT: "bottom-right",
    },
    SPACING: {
      SMALL: "10px",
      MEDIUM: "8px",
      LARGE: "4px",
    },
    Z_INDEX: {
      STATS_PANEL: "1000",
    },
    DIMENSIONS: {
      DEBUG_INFO_MAX_WIDTH: 400,
      DEBUG_INFO_MAX_HEIGHT: "80vh",
      MOBILE_ZOOM_MULTIPLIER: 0.19,
      DESKTOP_ZOOM: 140,
    },
    COLORS: {
      SUCCESS: "#4CAF50",
      WARNING: "#FF9800",
      DANGER: "#F44336",
    },
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
    DETERMINISTIC: {
      LCG_MULTIPLIER: 1103515245,
      LCG_INCREMENT: 12345,
      LCG_MASK: 0x7fffffff,
      BOOLEAN_THRESHOLD: 0.5,
    },
  },

  TERRAIN: {
    SAND: {
      holeRadius: 0.28,
    },
    GRASS: {
      size: 64,
    },
  },

  SIMULATION: {
    DEFAULT_SEED: 12345,
    DEFAULT_BOARD_SIZE: 10,
    MAX_SIMULATION_TURNS: 20,
    QUICK_GAME_TURNS: 2,
    RANDOM_GAME_MAX_TURNS: 15,
  },
} as const;

export const SHIP_VARIANTS_CONFIG = {
  small: {
    size: GAME_CONSTANTS.SHIPS.SIZES.small,
    url: "/assets/models/Small_Ship.glb",
    scale: [0.2, 0.2, 0.2] as [number, number, number],
    extraOffset: 0,
    groupOffset: { x: 0, y: 0, z: 0 },
    shipOffset: {
      horizontal: { x: 0, y: 0, z: 0 },
      vertical: { x: 0, y: 0, z: 0 },
    },
    waveFrequency: 3.5,
    waveAmplitude: 0.02,
  },
  medium: {
    size: GAME_CONSTANTS.SHIPS.SIZES.medium,
    url: "/assets/models/Medium_Ship.glb",
    scale: [0.2, 0.2, 0.2] as [number, number, number],
    extraOffset: 0,
    groupOffset: { x: 0, y: 0, z: 0 },
    shipOffset: {
      horizontal: { x: 0, y: 0, z: 0 },
      vertical: { x: 0, y: 0, z: 0 },
    },
    waveFrequency: 3.0,
    waveAmplitude: 0.025,
  },
  large: {
    size: GAME_CONSTANTS.SHIPS.SIZES.large,
    url: "/assets/models/Large_Ship.glb",
    scale: [0.2, 0.2, 0.23] as [number, number, number],
    extraOffset: 0,
    groupOffset: { x: -0.1, y: -0.1, z: 0 },
    shipOffset: {
      horizontal: { x: -0.1, y: 0.1, z: 0 },
      vertical: { x: 0, y: 0, z: 0 },
    },
    waveFrequency: 2.5,
    waveAmplitude: 0.03,
  },
  xlarge: {
    size: GAME_CONSTANTS.SHIPS.SIZES.xlarge,
    url: "/assets/models/XLarge_Ship.glb",
    scale: [0.2, 0.2, 0.3] as [number, number, number],
    extraOffset: 0,
    groupOffset: { x: 0, y: 0.1, z: 0 },
    shipOffset: {
      horizontal: { x: -0.1, y: -0.1, z: 0 },
      vertical: { x: 0, y: -0.1, z: 0 },
    },
    waveFrequency: 2.0,
    waveAmplitude: 0.035,
  },
} as const;

export const GAME_CONFIGS = {
  QUICK: {
    boardWidth: 8,
    boardHeight: 8,
    shipCounts: {
      small: 2,
      medium: 1,
      large: 0,
      xlarge: 0,
    },
    initialTurn: "random" as const,
    allowShipOverlap: false,
    minShipDistance: GAME_CONSTANTS.SHIPS.MIN_DISTANCE,
    enemyAI: "random" as const,
  },
  CLASSIC: {
    boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
    boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
    shipCounts: GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS,
    initialTurn: "random" as const,
    allowShipOverlap: false,
    minShipDistance: GAME_CONSTANTS.SHIPS.MIN_DISTANCE,
    enemyAI: "random" as const,
  },
  CHALLENGING: {
    boardWidth: 12,
    boardHeight: 12,
    shipCounts: {
      small: 5,
      medium: 4,
      large: 3,
      xlarge: 2,
    },
    initialTurn: "enemy" as const,
    allowShipOverlap: false,
    minShipDistance: GAME_CONSTANTS.SHIPS.MIN_DISTANCE,
    enemyAI: "smart" as const,
  },
} as const;
