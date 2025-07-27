export interface PressGridProps {
  className?: string;
}

export interface Explosion {
  id: number;
  pos: [number, number, number];
}

export interface ShotResult {
  x: number;
  y: number;
  hit: boolean;
  shipId?: string;
} 