import type { GameGridProps } from '../GameGrid/GameGrid.types';

export interface GameProps {
  showPlayerBoard?: boolean;
  showEnemyBoard?: boolean;
  playerBoardProps?: Partial<GameGridProps>;
  enemyBoardProps?: Partial<GameGridProps>;
  className?: string;
} 