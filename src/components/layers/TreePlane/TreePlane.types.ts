export interface TreePlaneProps {
  className?: string;
}

export interface TreeConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  variant: 1 | 2 | 3;
} 