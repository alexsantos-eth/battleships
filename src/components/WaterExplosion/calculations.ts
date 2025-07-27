import { GAME_CONSTANTS } from '@/utils/constants';

export interface ExplosionPosition {
  x: number;
  y: number;
  z: number;
}

export interface ExplosionAnimation {
  from: ExplosionPosition;
  to: ExplosionPosition;
  opacity: {
    from: number;
    to: number;
  };
}

export interface DropletDirection {
  id: number;
  dir: [number, number];
}

export interface ExplosionPattern {
  rings: number[];
  drops: DropletDirection[];
}

export const DROPLET_COUNT = GAME_CONSTANTS.ANIMATIONS.DROPLET.count;

export const generateRandomAngle = (): number => {
  return Math.random() * Math.PI * 2;
};

export const calculateDropletDirection = (angle: number): [number, number] => {
  return [Math.cos(angle), Math.sin(angle)];
};

export const generateExplosionPattern = (): ExplosionPattern => {
  const timestamp = Date.now();
  const rings = [timestamp];
  
  const drops: DropletDirection[] = Array.from({ length: DROPLET_COUNT }, (_, i) => {
    const angle = generateRandomAngle();
    return {
      id: i,
      dir: calculateDropletDirection(angle),
    };
  });

  return {
    rings,
    drops,
  };
};

export const calculateDropletDistance = (direction: [number, number], distance: number): [number, number] => {
  return [direction[0] * distance, direction[1] * distance];
};

export const validateDirection = (direction: [number, number]): boolean => {
  const [x, y] = direction;
  const magnitude = Math.sqrt(x * x + y * y);
  return Math.abs(magnitude - 1) < 0.001;
}; 