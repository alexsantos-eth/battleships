export const SHIP_SPACING = 0.5;
export const GRID_SIZE = 10;

export interface ShipPosition {
  x: number;
  y: number;
  z: number;
}

export interface ShipRotation {
  x: number;
  y: number;
  z: number;
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
  orientation: "horizontal" | "vertical",
  shipSize: number,
  extraOffset: number = 0
): ShipPosition => {
  const posX =
    coords[0] * SHIP_SPACING -
    (SHIP_SPACING * GRID_SIZE) / 2 +
    (orientation === "vertical"
      ? SHIP_SPACING / 2
      : (SHIP_SPACING * shipSize) / 2);

  const posY =
    coords[1] * SHIP_SPACING -
    (SHIP_SPACING * GRID_SIZE) / 2 +
    (orientation === "vertical"
      ? (SHIP_SPACING * shipSize) / 2
      : SHIP_SPACING / 2);

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
): ShipRotation => {
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
  const phase = (coords[0] + coords[1]) * 0.5;

  const waveY = Math.sin(time * frequency + phase) * amplitude;
  const waveZ = Math.cos(time * frequency * 0.7 + phase) * (amplitude * 0.5);

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