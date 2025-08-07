export interface WaterPlaneProps {
  size?: [number, number];
  segments?: [number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  className?: string;
  amplitude?: number;
  speed?: number;
  scale?: number;
}

export interface WaterAnimationConfig {
  scale: number;
  amplitude: number;
  speed: number;
}
