export interface GameGridProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  enablePressGrid?: boolean;
  isPlayerBoard?: boolean;
  showShips?: boolean;
  showShots?: boolean;
  alwaysShowEnemyShips?: boolean;
  className?: string;
} 