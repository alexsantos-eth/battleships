export interface DropletProps {
  position: [number, number];
  dir: [number, number];
  onDone: () => void;
  className?: string;
} 