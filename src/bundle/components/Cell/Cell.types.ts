export interface CellProps {
  position: [number, number, number];
  onClick: (position: [number, number, number]) => void;
  isShot?: boolean;
  isHit?: boolean;
  disabled?: boolean;
} 