import { GAME_CONSTANTS } from '@/constants/game';

export const SHIP_SPACING = GAME_CONSTANTS.BOARD.SHIP_SPACING;

export interface ShipPosition {
  x: number;
  y: number;
  z: number;
}

export interface ShipAnimation {
  position: ShipPosition;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ShipPlaneSize {
  width: number;
  height: number;
}

export interface WaveAnimation {
  y: number;
  z: number;
}

export const calculateShipPosition = (
  coords: [number, number],
  boardWidth: number,
  boardHeight: number,
  orientation: "horizontal" | "vertical",
  shipSize: number,
  extraOffset: number = 0
): ShipPosition => {
  const gridSize = Math.max(boardWidth, boardHeight);
  
  const posX = coords[0] * SHIP_SPACING - (SHIP_SPACING * gridSize) / 2 + 
    (orientation === "vertical" ? SHIP_SPACING / 2 : (SHIP_SPACING * shipSize) / 2);
  
  const posY = coords[1] * SHIP_SPACING - (SHIP_SPACING * gridSize) / 2 + 
    (orientation === "vertical" ? (SHIP_SPACING * shipSize) / 2 : SHIP_SPACING / 2);

  const orientationOffsetY = orientation === "vertical" ? extraOffset : 0;
  const orientationOffsetX = orientation === "vertical" ? 0 : extraOffset;

  return {
    x: posX + orientationOffsetX,
    y: posY + orientationOffsetY,
    z: 0.18,
  };
};

export const calculateShipRotation = (
  orientation: "horizontal" | "vertical"
): { x: number; y: number; z: number } => {
  if (orientation === "vertical") {
    return {
      x: -Math.PI / 2,
      y: 0,
      z: Math.PI,
    };
  } else {
    return {
      x: -Math.PI / 2,
      y: Math.PI / 2,
      z: -Math.PI,
    };
  }
};

export const calculateShipScale = (
  variant: "small" | "medium" | "large" | "xlarge"
): { x: number; y: number; z: number } => {
  const baseScale = 0.2;
  const zScale = variant === "large" ? 0.23 : variant === "xlarge" ? 0.3 : baseScale;

  return {
    x: baseScale,
    y: baseScale,
    z: zScale,
  };
};

export const calculateShipPlaneSize = (
  shipSize: number,
  orientation: "horizontal" | "vertical"
): ShipPlaneSize => {
  const gridSize = shipSize * SHIP_SPACING;

  if (orientation === "horizontal") {
    return {
      width: gridSize,
      height: SHIP_SPACING,
    };
  } else {
    return {
      width: SHIP_SPACING,
      height: gridSize,
    };
  }
};

export const calculateWaveAnimation = (
  time: number,
  frequency: number,
  amplitude: number,
  coords: [number, number]
): WaveAnimation => {
  const phase = (coords[0] + coords[1]) * GAME_CONSTANTS.ANIMATIONS.WAVE.phaseMultiplier;

  const waveY = Math.sin(time * frequency + phase) * amplitude;
  const waveZ = Math.cos(time * frequency * GAME_CONSTANTS.ANIMATIONS.WAVE.frequencyMultiplier + phase) * (amplitude * GAME_CONSTANTS.ANIMATIONS.WAVE.amplitudeMultiplier);

  return {
    y: waveY,
    z: waveZ,
  };
};

export const calculateOrientationOffset = (
  orientation: "horizontal" | "vertical",
  extraOffset: number
): { x: number; y: number } => {
  const orientationOffsetY = orientation === "vertical" ? extraOffset : 0;
  const orientationOffsetX = orientation === "vertical" ? 0 : extraOffset;

  return {
    x: orientationOffsetX,
    y: orientationOffsetY,
  };
};

export const calculateShipAnimation = (
  coords: [number, number],
  boardWidth: number,
  boardHeight: number,
  orientation: "horizontal" | "vertical",
  variant: "small" | "medium" | "large" | "xlarge",
  extraOffset: number = 0,
  time: number = 0
): ShipAnimation => {
  const shipSize = GAME_CONSTANTS.SHIPS.SIZES[variant];
  const position = calculateShipPosition(coords, boardWidth, boardHeight, orientation, shipSize, extraOffset);
  const rotation = calculateShipRotation(orientation);
  const scale = calculateShipScale(variant);

  const phase = (coords[0] + coords[1]) * GAME_CONSTANTS.ANIMATIONS.WAVE.phaseMultiplier;
  const frequency = variant === "small" ? 3.5 : variant === "medium" ? 3.0 : variant === "large" ? 2.5 : 2.0;
  const amplitude = variant === "small" ? 0.02 : variant === "medium" ? 0.025 : variant === "large" ? 0.03 : 0.035;

  const waveZ = Math.cos(time * frequency * GAME_CONSTANTS.ANIMATIONS.WAVE.frequencyMultiplier + phase) * (amplitude * GAME_CONSTANTS.ANIMATIONS.WAVE.amplitudeMultiplier);

  return {
    position: { ...position, z: position.z + waveZ },
    rotation,
    scale,
  };
};

export const calculateShipCells = (
  x: number,
  y: number,
  size: number,
  orientation: "horizontal" | "vertical"
): [number, number][] => {
  const cells: [number, number][] = [];

  for (let i = 0; i < size; i++) {
    const cellX = orientation === "horizontal" ? x + i : x;
    const cellY = orientation === "vertical" ? y + i : y;
    cells.push([cellX, cellY]);
  }

  return cells;
};

export const calculateModelOffset = (): { x: number; y: number } => {
  return { x: 0, y: 0 };
};

export const calculateGroupOffset = (
  groupOffset: { x: number; y: number; z: number },
  orientation: "horizontal" | "vertical",
  extraOffset: number = 0
): { x: number; y: number; z: number } => {
  const baseOffset = {
    x: groupOffset.x,
    y: groupOffset.y,
    z: groupOffset.z,
  };

  if (orientation === "vertical") {
    return {
      x: baseOffset.y + extraOffset,
      y: baseOffset.x,
      z: baseOffset.z,
    };
  } else {
    return {
      x: baseOffset.x + extraOffset,
      y: baseOffset.y,
      z: baseOffset.z,
    };
  }
};

export const calculateShipModelOffset = (
  shipOffset: {
    horizontal: { x: number; y: number; z: number };
    vertical: { x: number; y: number; z: number };
  },
  orientation: "horizontal" | "vertical"
): { x: number; y: number; z: number } => {
  return shipOffset[orientation];
};
