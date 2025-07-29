export interface GameConfig {
  boardWidth: number;
  boardHeight: number;

  shipCounts: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };

  initialTurn: "player" | "enemy" | "random";

  seed?: number;
  allowShipOverlap: boolean;
  minShipDistance: number;

  enemyAI: "random" | "smart" | "deterministic" | "basic";

  turnTimeLimit?: number;
}
