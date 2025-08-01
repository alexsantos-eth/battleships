export const GAME_CONSTANTS = {
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

  CAMERA: {
    MOBILE_BREAKPOINT: 768,
    POSITIONS: {
      PLAYER: {
        position: [0, -3, 5] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        mobile: {
          position: [0, -3, 5] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
        },
      },
      ENEMY: {
        position: [0, 12, 5] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
      },
      PERSPECTIVE: {
        position: [0, -4.6, 5] as [number, number, number],
        rotation: [Math.PI/4, 0, 0] as [number, number, number],
        mobile: {
          position: [0, -3, 5] as [number, number, number]
        }
      },
      SHOOT_START: {
        position: [0, 8, -8] as [number, number, number],
        rotation: [Math.PI / 6, 0, 0] as [number, number, number],
      },
      SHOOT_END: {
        position: [0, 8, 8] as [number, number, number],
        rotation: [-Math.PI / 6, 0, 0] as [number, number, number],
      },
    },
    SETTINGS: {
      far: 3000,
      near: -100,
      animationSpeed: 0.06,
      eventThrottleMs: 16,
      animationThrottleMs: 8,
      positionThreshold: 0.00001,
      rotationThreshold: 0.005,
    },
    TRANSITION_DURATION: 1000,
    LOOK_AT: [0, 0, 0] as [number, number, number],
  },

  EFFECTS: {
    WATER_EXPLOSION: {
      PARTICLE_COUNT: 50,
      DURATION: 2000,
      SPREAD: 2,
      GRAVITY: 0.1,
    },
    DROPLET: {
      PARTICLE_COUNT: 20,
      DURATION: 1500,
      SPREAD: 1,
      GRAVITY: 0.05,
    },
  },

  ANIMATIONS: {
    DROPLET: {
      DISTANCE: 0.5,
      START_Z: 0.15,
      END_Z: 0.5,
      START_OPACITY: 1,
      END_OPACITY: 0,
      DURATION: 400,
      COUNT: 10,
    },
    SHOT: {
      DEFAULT_DELAY: 500,
      HIT_DELAY: 1000,
      MISS_DELAY: 600,
      VISUAL_HIT_DELAY: 1200,
      VISUAL_MISS_DELAY: 800,
    },
    WAVE: {
      FREQUENCY_MULTIPLIER: 0.7,
      AMPLITUDE_MULTIPLIER: 0.5,
      PAHSE_MULTIPLIER: 0.5,
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
  },

  TERRAIN: {
    SAND: {
      HOLE_RADIUS: 0.17,
      TRANSITION_DISTANCE: 0.345,
      DEFAULT_HEIGHT: 0.015,
      DEFAULT_LEVELS: 1,
      DEFAULT_SCALE: 5,
      DEFAULT_OFFSET: { x: 0, z: 0 },
      GROUP_SCALE: 13,
      GROUP_POSITION_Y: -0.2,
      GROUP_ROTATION: Math.PI / 2,
    },
    GRASS: {
      SIZE: 64,
    },
  },
} as const;

export const SHIP_VARIANTS_CONFIG = {
  small: {
    modelUrl: "/assets/models/Small_Ship.glb",
    scale: 0.5,
    health: 2,
    size: 2,
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
    modelUrl: "/assets/models/Medium_Ship.glb",
    scale: 0.7,
    health: 3,
    size: 3,
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
    modelUrl: "/assets/models/Large_Ship.glb",
    scale: 0.9,
    health: 4,
    size: 4,
    extraOffset: 0,
    groupOffset: { x: 0, y: 0, z: 0 },
    shipOffset: {
      horizontal: { x: 0, y: 0, z: 0 },
      vertical: { x: 0, y: 0, z: 0 },
    },
    waveFrequency: 2.5,
    waveAmplitude: 0.03,
  },
  xlarge: {
    modelUrl: "/assets/models/XLarge_Ship.glb",
    scale: 1.1,
    health: 5,
    size: 5,
    extraOffset: 0,
    groupOffset: { x: 0, y: 0, z: 0 },
    shipOffset: {
      horizontal: { x: 0, y: 0, z: 0 },
      vertical: { x: 0, y: 0, z: 0 },
    },
    waveFrequency: 2.0,
    waveAmplitude: 0.035,
  },
} as const;
