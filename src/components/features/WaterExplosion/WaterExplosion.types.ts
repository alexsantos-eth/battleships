export interface WaterExplosionProps {
  position: [number, number];
  onDone?: () => void;
  className?: string;
}

export interface DropConfig {
  id: number;
  dir: [number, number];
} 