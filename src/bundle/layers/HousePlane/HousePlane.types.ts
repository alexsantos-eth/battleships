export interface HousePlaneProps {
  className?: string;
}

export interface HouseConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  variant: 1 | 2 | 3 | 4;
} 