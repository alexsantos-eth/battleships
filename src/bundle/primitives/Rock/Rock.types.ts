export interface RockProps {
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  className?: string;
} 