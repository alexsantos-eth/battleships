export interface TreePlaneProps {
  className?: string;
  isPlayerBoard?: boolean;
}

export interface TreeConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  variant: 1 | 2 | 3;
  hidenInPlayer?: boolean;
  hidenInEnemy?: boolean;
} 