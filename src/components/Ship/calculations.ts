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
  // Usar la lógica original que funcionaba
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

  // Ajustes específicos por tamaño de barco para el grupo completo
  let groupOffsetX = 0;
  let groupOffsetY = 0;

  if (shipSize === 2) {
    groupOffsetX = 0;
    groupOffsetY = 0;
  } else if (shipSize === 3) {
    groupOffsetX = 0;
    groupOffsetY = 0;
  } else if (shipSize === 4) {
    groupOffsetX = orientation === "horizontal" ? -0.1 : 0;
    groupOffsetY = orientation === "horizontal" ? 0 : -0.1;
  } else if (shipSize === 5) {
    groupOffsetX = orientation === "horizontal" ? -0.1 : 0;
    groupOffsetY = orientation === "horizontal" ? 0 : -0.1;
  }

  const orientationOffsetY = orientation === "vertical" ? extraOffset : 0;
  const orientationOffsetX = orientation === "vertical" ? 0 : extraOffset;

  return {
    x: posX + orientationOffsetX - groupOffsetX,
    y: posY + orientationOffsetY - groupOffsetY,
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

// Función para calcular el offset del modelo 3D (ahora sin offset)
export const calculateModelOffset = (): { x: number; y: number } => {
  // Sin offset adicional, el grupo ya está ajustado
  return {
    x: 0,
    y: 0,
  };
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
