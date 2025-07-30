import type { PlayerName } from "./common";

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;

  shipCounts: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };

  initialTurn: PlayerName | "random";
}
