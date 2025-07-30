export interface ShipProps {
  coords: [number, number];
  variant: "small" | "medium" | "large" | "xlarge";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export interface ShipConfig {
  url: string;
  size: number;
  color: string;
  waveFrequency: number;
  waveAmplitude: number;
  extraOffset: number;
  groupOffset: { x: number; y: number; z: number };
  shipOffset: { x: number; y: number; z: number };
}

export interface ShipPosition {
  x: number;
  y: number;
  z: number;
}

export interface ShipSize {
  width: number;
  height: number;
}

export interface WaveAnimation {
  y: number;
  z: number;
}

export interface ShipProps {
  coords: [number, number];
  orientation?: "horizontal" | "vertical";
  variant: "small" | "medium" | "large" | "xlarge";
}
