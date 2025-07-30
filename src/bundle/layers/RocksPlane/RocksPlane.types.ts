export interface RocksPlaneProps {
  className?: string;
}

export interface RockConfig {
  id: string;
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  position: [number, number, number];
  rotation: [number, number, number];
} 