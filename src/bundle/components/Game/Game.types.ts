import type { GameGridProps } from "../GameGrid";

export interface GameProps {
  showPlayerBoard?: boolean;
  showEnemyBoard?: boolean;
  playerBoardProps?: Partial<GameGridProps>;
  enemyBoardProps?: Partial<GameGridProps>;
  className?: string;
}
