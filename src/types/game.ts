export type GameTurn = 'PLAYER_TURN' | 'ENEMY_TURN';
export type Winner = 'player' | 'enemy' | null;
export type ShipVariant = 'small' | 'medium' | 'large' | 'xlarge';
export type ShipOrientation = 'horizontal' | 'vertical';

export interface Ship {
  id: string;
  coords: [number, number];
  variant: ShipVariant;
  orientation: ShipOrientation;
  health: number;
}

export interface Shot {
  id: string;
  x: number;
  y: number;
  hit: boolean;
  shipId?: string;
  timestamp: number;
}

export interface GameState {
  currentTurn: GameTurn;
  playerShips: Ship[];
  enemyShips: Ship[];
  playerShots: Shot[];
  enemyShots: Shot[];
  isGameOver: boolean;
  winner: Winner;
  boardWidth: number;
  boardHeight: number;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  shipCounts: Record<ShipVariant, number>;
}

export interface ShipPlacement {
  ship: Ship;
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