/**
 * BATTLESHIP GAME ENGINE - STANDALONE VERSION
 * 
 * Este archivo contiene toda la lógica del motor de juego en un solo archivo.
 * Úsalo cuando quieras máxima portabilidad sin estructura de directorios.
 * 
 * Uso:
 * ```typescript
 * import { GameEngine, AIPlayer, generateShips } from './standalone';
 * 
 * const engine = new GameEngine();
 * const ships = generateShips({ boardWidth: 10, boardHeight: 10 });
 * engine.initializeGame(ships, ships, 'PLAYER_TURN');
 * ```
 * 
 * @version 1.0.0
 * @license MIT
 */

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

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

export interface GameEngineState {
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

export interface GameEngineCallbacks {
  onStateChange?: (state: GameEngineState) => void;
  onTurnChange?: (turn: GameTurn) => void;
  onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  onGameOver?: (winner: Winner) => void;
}

export interface ShotResult {
  hit: boolean;
  shipId?: number;
  position: [number, number];
  alreadyShot: boolean;
}

// ============================================================================
// CONSTANTES DEL JUEGO
// ============================================================================

export const GAME_CONSTANTS = {
  SHIPS: {
    SIZES: {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    } as const,
    DEFAULT_COUNTS: {
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 1,
    } as const,
    MIN_DISTANCE: 2,
    MAX_PLACEMENT_ATTEMPTS: 200,
    MAX_GENERATION_ATTEMPTS: 1000,
  },
};

// ============================================================================
// UTILIDADES DE BARCOS
// ============================================================================

export function getShipCells(
  x: number,
  y: number,
  size: number,
  orientation: "horizontal" | "vertical"
): [number, number][] {
  const cells: [number, number][] = [];

  if (orientation === "horizontal") {
    for (let i = 0; i < size; i++) {
      cells.push([x + i, y]);
    }
  } else {
    for (let i = 0; i < size; i++) {
      cells.push([x, y + i]);
    }
  }

  return cells;
}

export function getShipCellsFromShip(ship: GameShip): [number, number][] {
  const size = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];
  const [x, y] = ship.coords;

  return getShipCells(x, y, size, ship.orientation);
}

export function getShipSize(variant: ShipVariant): number {
  return GAME_CONSTANTS.SHIPS.SIZES[variant];
}

export function isValidShipPlacement(
  ship: GameShip,
  existingShips: GameShip[],
  boardWidth: number,
  boardHeight: number
): boolean {
  const shipCells = getShipCellsFromShip(ship);

  for (const [x, y] of shipCells) {
    if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
      return false;
    }
  }

  for (const existingShip of existingShips) {
    const existingCells = getShipCellsFromShip(existingShip);

    for (const [x1, y1] of shipCells) {
      for (const [x2, y2] of existingCells) {
        const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        if (distance < GAME_CONSTANTS.SHIPS.MIN_DISTANCE) {
          return false;
        }
      }
    }
  }

  return true;
}

export function generateShips(
  config: Partial<GameConfig> = {}
): GameShip[] {
  const boardWidth = config.boardWidth ?? 10;
  const boardHeight = config.boardHeight ?? 10;
  const shipCounts = {
    ...GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS,
    ...config.shipCounts,
  };

  const ships: GameShip[] = [];
  const variants: ShipVariant[] = ["xlarge", "large", "medium", "small"];

  let totalAttempts = 0;

  for (const variant of variants) {
    const count = shipCounts[variant];
    const size = GAME_CONSTANTS.SHIPS.SIZES[variant];

    for (let i = 0; i < count; i++) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < GAME_CONSTANTS.SHIPS.MAX_PLACEMENT_ATTEMPTS) {
        attempts++;
        totalAttempts++;

        if (totalAttempts > GAME_CONSTANTS.SHIPS.MAX_GENERATION_ATTEMPTS) {
          console.warn('Max generation attempts reached, restarting...');
          return generateShips(config);
        }

        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const maxX = orientation === "horizontal" ? boardWidth - size : boardWidth;
        const maxY = orientation === "vertical" ? boardHeight - size : boardHeight;

        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        const newShip: GameShip = {
          coords: [x, y],
          variant,
          orientation,
          shipId: ships.length,
        };

        if (isValidShipPlacement(newShip, ships, boardWidth, boardHeight)) {
          ships.push(newShip);
          placed = true;
        }
      }

      if (!placed) {
        console.warn(`Failed to place ${variant} ship, restarting generation...`);
        return generateShips(config);
      }
    }
  }

  return ships;
}

// ============================================================================
// GAME ENGINE (Motor Principal)
// ============================================================================

export class GameEngine {
  private currentTurn: GameTurn;
  private playerShips: GameShip[];
  private enemyShips: GameShip[];
  private playerShots: Shot[];
  private enemyShots: Shot[];
  private isGameOver: boolean;
  private winner: Winner;
  private boardWidth: number;
  private boardHeight: number;
  private shotCount: number;
  
  private onStateChange?: (state: GameEngineState) => void;
  private onTurnChange?: (turn: GameTurn) => void;
  private onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  private onGameOver?: (winner: Winner) => void;

  constructor(config: Partial<GameConfig> = {}, callbacks?: GameEngineCallbacks) {
    this.boardWidth = config.boardWidth ?? 10;
    this.boardHeight = config.boardHeight ?? 10;
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.onStateChange = callbacks?.onStateChange;
    this.onTurnChange = callbacks?.onTurnChange;
    this.onShot = callbacks?.onShot;
    this.onGameOver = callbacks?.onGameOver;
  }

  initializeGame(
    playerShips: GameShip[],
    enemyShips: GameShip[],
    initialTurn: GameTurn = "PLAYER_TURN"
  ): void {
    this.playerShips = playerShips;
    this.enemyShips = enemyShips;
    this.currentTurn = initialTurn;
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.notifyStateChange();
  }

  executeShot(x: number, y: number, isPlayerShot: boolean): ShotResult {
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;
    const targetShips = isPlayerShot ? this.enemyShips : this.playerShips;

    const alreadyShot = shots.some(shot => shot.x === x && shot.y === y);
    if (alreadyShot) {
      return { hit: false, position: [x, y], alreadyShot: true };
    }

    const shotResult = this.checkShot(x, y, targetShips);
    const newShot: Shot = {
      x,
      y,
      hit: shotResult.hit,
      shipId: shotResult.shipId,
    };

    shots.push(newShot);
    this.shotCount++;

    this.onShot?.(newShot, isPlayerShot);

    const gameOver = this.checkGameOver();
    if (gameOver) {
      this.isGameOver = true;
      this.winner = isPlayerShot ? "player" : "enemy";
      this.onGameOver?.(this.winner);
    }

    this.notifyStateChange();

    return {
      hit: shotResult.hit,
      shipId: shotResult.shipId,
      position: [x, y],
      alreadyShot: false,
    };
  }

  private checkShot(x: number, y: number, ships: GameShip[]): { hit: boolean; shipId?: number } {
    for (const ship of ships) {
      const shipCells = getShipCellsFromShip(ship);
      for (const [cellX, cellY] of shipCells) {
        if (cellX === x && cellY === y) {
          return { hit: true, shipId: ship.shipId };
        }
      }
    }
    return { hit: false };
  }

  private checkGameOver(): boolean {
    const targetShips = this.currentTurn === "PLAYER_TURN" ? this.enemyShips : this.playerShips;
    const shots = this.currentTurn === "PLAYER_TURN" ? this.playerShots : this.enemyShots;

    for (const ship of targetShips) {
      const shipCells = getShipCellsFromShip(ship);
      const allCellsHit = shipCells.every(([x, y]) =>
        shots.some(shot => shot.x === x && shot.y === y && shot.hit)
      );

      if (!allCellsHit) {
        return false;
      }
    }

    return true;
  }

  toggleTurn(): void {
    this.currentTurn = this.currentTurn === "PLAYER_TURN" ? "ENEMY_TURN" : "PLAYER_TURN";
    this.onTurnChange?.(this.currentTurn);
    this.notifyStateChange();
  }

  getState(): GameEngineState {
    return {
      currentTurn: this.currentTurn,
      playerShips: [...this.playerShips],
      enemyShips: [...this.enemyShips],
      playerShots: [...this.playerShots],
      enemyShots: [...this.enemyShots],
      isGameOver: this.isGameOver,
      winner: this.winner,
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
      shotCount: this.shotCount,
    };
  }

  getCurrentTurn(): GameTurn {
    return this.currentTurn;
  }

  isPlayerTurn(): boolean {
    return this.currentTurn === "PLAYER_TURN";
  }

  getPlayerShips(): GameShip[] {
    return [...this.playerShips];
  }

  getEnemyShips(): GameShip[] {
    return [...this.enemyShips];
  }

  getPlayerShots(): Shot[] {
    return [...this.playerShots];
  }

  getEnemyShots(): Shot[] {
    return [...this.enemyShots];
  }

  getBoardDimensions(): { width: number; height: number } {
    return { width: this.boardWidth, height: this.boardHeight };
  }

  getWinner(): Winner {
    return this.winner;
  }

  isCellShot(x: number, y: number, isPlayer: boolean): boolean {
    const shots = isPlayer ? this.playerShots : this.enemyShots;
    return shots.some(shot => shot.x === x && shot.y === y);
  }

  resetGame(): void {
    this.currentTurn = "PLAYER_TURN";
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;
    this.notifyStateChange();
  }

  private notifyStateChange(): void {
    this.onStateChange?.(this.getState());
  }
}

// ============================================================================
// AI PLAYER (Jugador Artificial)
// ============================================================================

export class AIPlayer {
  protected engine: GameEngine;
  protected availablePositions: [number, number][];

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.availablePositions = [];
    this.updateAvailablePositions();
  }

  protected updateAvailablePositions(): void {
    const { width, height } = this.engine.getBoardDimensions();
    this.availablePositions = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (!this.engine.isCellShot(x, y, false)) {
          this.availablePositions.push([x, y]);
        }
      }
    }
  }

  generateRandomShot(): [number, number] | null {
    this.updateAvailablePositions();

    if (this.availablePositions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.availablePositions.length);
    return this.availablePositions[randomIndex];
  }

  executeTurn(): ShotResult | null {
    const position = this.generateRandomShot();

    if (!position) {
      return null;
    }

    const [x, y] = position;
    return this.engine.executeShot(x, y, false);
  }

  hasAvailablePositions(): boolean {
    this.updateAvailablePositions();
    return this.availablePositions.length > 0;
  }
}

export class SmartAIPlayer extends AIPlayer {
  private hitQueue: [number, number][] = [];

  executeTurn(): ShotResult | null {
    let position: [number, number] | null = null;

    if (this.hitQueue.length > 0) {
      position = this.hitQueue.shift()!;
    } else {
      position = this.generateRandomShot();
    }

    if (!position) {
      return null;
    }

    const [x, y] = position;
    const result = this.engine.executeShot(x, y, false);

    if (result.hit && !result.alreadyShot) {
      const adjacentCells = this.getAdjacentCells(x, y);
      for (const cell of adjacentCells) {
        if (!this.engine.isCellShot(cell[0], cell[1], false)) {
          if (!this.hitQueue.some(([qx, qy]) => qx === cell[0] && qy === cell[1])) {
            this.hitQueue.push(cell);
          }
        }
      }
    }

    return result;
  }

  private getAdjacentCells(x: number, y: number): [number, number][] {
    const { width, height } = this.engine.getBoardDimensions();
    const adjacent: [number, number][] = [];

    if (x > 0) adjacent.push([x - 1, y]);
    if (x < width - 1) adjacent.push([x + 1, y]);
    if (y > 0) adjacent.push([x, y - 1]);
    if (y < height - 1) adjacent.push([x, y + 1]);

    return adjacent;
  }
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

export function quickDemo(): void {
  console.log('🎮 Battleship Engine - Quick Demo\n');

  // Crear engine
  const engine = new GameEngine();
  
  // Generar barcos
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  
  // Inicializar juego
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
  
  // Crear IA
  const ai = new AIPlayer(engine);
  
  // Jugar 5 turnos
  for (let i = 0; i < 5; i++) {
    if (!engine.getState().isGameOver) {
      const result = ai.executeTurn();
      console.log(`Turn ${i + 1}:`, result?.hit ? 'HIT! 💥' : 'Miss 🌊');
      engine.toggleTurn();
    }
  }
  
  console.log('\n✅ Demo completed!');
  console.log('State:', engine.getState());
}

// Descomentar para ejecutar demo:
// quickDemo();
