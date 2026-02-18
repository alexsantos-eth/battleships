export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";
export type PlayerName = "player" | "enemy";
export type Winner = PlayerName | null;
export type ShipVariant = "small" | "medium" | "large" | "xlarge";
export type ShipOrientation = "horizontal" | "vertical";

export interface GameShip {
  coords: [number, number];
  variant: ShipVariant;
  orientation: ShipOrientation;
  shipId?: number;
}

export interface Shot {
  x: number;
  y: number;
  hit: boolean;
  shipId?: number;
}

export interface GameState {
  currentTurn: GameTurn;
  playerShips: GameShip[];
  enemyShips: GameShip[];
  playerShots: Shot[];
  enemyShots: Shot[];
  isGameOver: boolean;
  winner: Winner;
  boardWidth: number;
  boardHeight: number;
  shotCount: number;
}

export interface ShipPlacement {
  ship: GameShip;
  cells: [number, number][];
}

export interface ShotRecord {
  x: number;
  y: number;
  hit: boolean;
  shipId?: string;
  turn: GameTurn;
  timestamp: number;
}

export interface BattleResult {
  winner: Winner;
  totalTurns: number;
  playerShots: number;
  enemyShots: number;
  playerHits: number;
  enemyHits: number;
  shipPlacements: { player: ShipPlacement[]; enemy: ShipPlacement[] };
  shotHistory: ShotRecord[];
}

export type PlayerRole = "host" | "guest";
