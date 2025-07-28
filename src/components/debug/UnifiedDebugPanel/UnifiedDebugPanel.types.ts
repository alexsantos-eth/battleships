export interface UnifiedDebugPanelProps {
  className?: string;
  showPlayerBoard?: boolean;
  setShowPlayerBoard?: (show: boolean) => void;
  showEnemyBoard?: boolean;
  setShowEnemyBoard?: (show: boolean) => void;
  showShips?: boolean;
  setShowShips?: (show: boolean) => void;
  showShots?: boolean;
  setShowShots?: (show: boolean) => void;
  alwaysShowEnemyShips?: boolean;
  setAlwaysShowEnemyShips?: (show: boolean) => void;
} 