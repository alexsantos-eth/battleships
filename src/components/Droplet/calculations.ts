export interface DropletPosition {
  x: number;
  y: number;
  z: number;
}

export interface DropletAnimation {
  from: DropletPosition;
  to: DropletPosition;
  opacity: {
    from: number;
    to: number;
  };
}

export const DROPLET_DISTANCE = 0.5;
export const DROPLET_START_Z = 0.15;
export const DROPLET_END_Z = 0.5;
export const DROPLET_START_OPACITY = 1;
export const DROPLET_END_OPACITY = 0;
export const DROPLET_ANIMATION_DURATION = 400;

export const calculateDropletStartPosition = (
  basePosition: [number, number]
): DropletPosition => {
  return {
    x: basePosition[0],
    y: basePosition[1],
    z: DROPLET_START_Z,
  };
};

export const calculateDropletEndPosition = (
  basePosition: [number, number],
  direction: [number, number]
): DropletPosition => {
  return {
    x: basePosition[0] + direction[0] * DROPLET_DISTANCE,
    y: basePosition[1] + direction[1] * DROPLET_DISTANCE,
    z: DROPLET_END_Z,
  };
};

export const calculateDropletAnimation = (
  basePosition: [number, number],
  direction: [number, number]
): DropletAnimation => {
  const from = calculateDropletStartPosition(basePosition);
  const to = calculateDropletEndPosition(basePosition, direction);

  return {
    from,
    to,
    opacity: {
      from: DROPLET_START_OPACITY,
      to: DROPLET_END_OPACITY,
    },
  };
};

export const calculateDropletDistance = (
  direction: [number, number]
): number => {
  return Math.sqrt(direction[0] ** 2 + direction[1] ** 2) * DROPLET_DISTANCE;
};

export const validateDropletDirection = (direction: [number, number]): boolean => {
  const magnitude = Math.sqrt(direction[0] ** 2 + direction[1] ** 2);
  return magnitude > 0;
}; 