import { GAME_CONSTANTS } from "../constants/game";
import { getShipCellsFromShip } from "../tools/ship/calculations";
import type { GameShip, Shot, Winner, GameTurn } from "../types/common";
import type { GameConfig } from "../types/config";

type PositionKey = string;
const posKey = (x: number, y: number): PositionKey => `${x},${y}`;

export class GameEngine {
  // Game state
  private currentTurn: GameTurn;
  private playerShips: GameShip[];
  private enemyShips: GameShip[];
  private isGameOver: boolean;
  private winner: Winner;
  private boardWidth: number;
  private boardHeight: number;
  private shotCount: number;

  private playerShotsMap: Map<PositionKey, Shot>;
  private enemyShotsMap: Map<PositionKey, Shot>;
  private playerShipPositions: Map<PositionKey, number>;
  private enemyShipPositions: Map<PositionKey, number>;
  private playerShipHits: Map<number, number>;
  private enemyShipHits: Map<number, number>;
  private playerShipSizes: Map<number, number>;
  private enemyShipSizes: Map<number, number>;

  // Optional callbacks to observe changes
  private onStateChange?: (state: GameEngineState) => void;
  private onTurnChange?: (turn: GameTurn) => void;
  private onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  private onGameOver?: (winner: Winner) => void;

  constructor(
    config: Partial<GameConfig> = {},
    callbacks?: GameEngineCallbacks,
  ) {
    this.boardWidth = config.boardWidth ?? GAME_CONSTANTS.BOARD.DEFAULT_WIDTH;
    this.boardHeight =
      config.boardHeight ?? GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT;
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.playerShotsMap = new Map();
    this.enemyShotsMap = new Map();
    this.playerShipPositions = new Map();
    this.enemyShipPositions = new Map();
    this.playerShipHits = new Map();
    this.enemyShipHits = new Map();
    this.playerShipSizes = new Map();
    this.enemyShipSizes = new Map();

    // Optional callbacks
    this.onStateChange = callbacks?.onStateChange;
    this.onTurnChange = callbacks?.onTurnChange;
    this.onShot = callbacks?.onShot;
    this.onGameOver = callbacks?.onGameOver;
  }

  /**
   * Initialize a new game with ships and starting turn
   * @param playerShips - Array of player's ships
   * @param enemyShips - Array of enemy's ships
   * @param initialTurn - Which player starts (defaults to PLAYER_TURN)
   */
  public initializeGame(
    playerShips: GameShip[],
    enemyShips: GameShip[],
    initialTurn: GameTurn = "PLAYER_TURN",
  ): void {
    this.playerShips = playerShips;
    this.enemyShips = enemyShips;
    this.currentTurn = initialTurn;
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.playerShotsMap.clear();
    this.enemyShotsMap.clear();
    this.playerShipPositions.clear();
    this.enemyShipPositions.clear();
    this.playerShipHits.clear();
    this.enemyShipHits.clear();
    this.playerShipSizes.clear();
    this.enemyShipSizes.clear();

    this.cacheShipPositions(
      playerShips,
      this.playerShipPositions,
      this.playerShipSizes,
    );
    this.cacheShipPositions(
      enemyShips,
      this.enemyShipPositions,
      this.enemyShipSizes,
    );

    this.notifyStateChange();
  }

  /**
   * Reset the game to initial state
   */
  public resetGame(): void {
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

    this.playerShotsMap.clear();
    this.enemyShotsMap.clear();
    this.playerShipPositions.clear();
    this.enemyShipPositions.clear();
    this.playerShipHits.clear();
    this.enemyShipHits.clear();
    this.playerShipSizes.clear();
    this.enemyShipSizes.clear();

    this.notifyStateChange();
  }

  /**
   * Set board dimensions
   * @param width - Board width in cells
   * @param height - Board height in cells
   */
  public setBoardDimensions(width: number, height: number): void {
    this.boardWidth = width;
    this.boardHeight = height;
    this.notifyStateChange();
  }

  /**
   * Get current turn
   * @returns Current game turn (PLAYER_TURN or ENEMY_TURN)
   */
  public getCurrentTurn(): GameTurn {
    return this.currentTurn;
  }

  /**
   * Check if it's the player's turn
   * @returns True if current turn is PLAYER_TURN
   */
  public isPlayerTurn(): boolean {
    return this.currentTurn === "PLAYER_TURN";
  }

  /**
   * Check if it's the enemy's turn
   * @returns True if current turn is ENEMY_TURN
   */
  public isEnemyTurn(): boolean {
    return this.currentTurn === "ENEMY_TURN";
  }

  /**
   * Set turn to player
   */
  public setPlayerTurn(): void {
    this.currentTurn = "PLAYER_TURN";
    this.onTurnChange?.(this.currentTurn);
    this.notifyStateChange();
  }

  /**
   * Set turn to enemy
   */
  public setEnemyTurn(): void {
    this.currentTurn = "ENEMY_TURN";
    this.onTurnChange?.(this.currentTurn);
    this.notifyStateChange();
  }

  /**
   * Toggle turn between player and enemy
   */
  public toggleTurn(): void {
    if (this.currentTurn === "PLAYER_TURN") {
      this.setEnemyTurn();
    } else {
      this.setPlayerTurn();
    }
  }

  /**
   * Execute a shot at target coordinates
   * @param x - X coordinate on board
   * @param y - Y coordinate on board
   * @param isPlayerShot - True if shot is from player, false if from enemy
   * @returns Result of the shot including hit status and game state
   */
  public executeShot(x: number, y: number, isPlayerShot: boolean): ShotResult {
    if (this.isCellShot(x, y, isPlayerShot)) {
      return {
        success: false,
        error: "Cell already shot",
        hit: false,
        shipId: -1,
      };
    }

    const result = this.checkShot(x, y, isPlayerShot);

    const shot: Shot = {
      x,
      y,
      hit: result.hit,
      shipId: result.shipId >= 0 ? result.shipId : undefined,
    };

    const key = posKey(x, y);
    const shotsMap = isPlayerShot ? this.playerShotsMap : this.enemyShotsMap;
    shotsMap.set(key, shot);

    if (result.hit && result.shipId >= 0) {
      const hitsMap = isPlayerShot ? this.enemyShipHits : this.playerShipHits;
      const currentHits = (hitsMap.get(result.shipId) || 0) + 1;
      hitsMap.set(result.shipId, currentHits);
    }

    this.shotCount++;
    this.onShot?.(shot, isPlayerShot);
    this.checkGameOver();

    const shipDestroyed =
      result.hit && result.shipId >= 0
        ? this.isShipDestroyed(result.shipId, isPlayerShot)
        : false;

    this.notifyStateChange();

    return {
      success: true,
      hit: result.hit,
      shipId: result.shipId,
      shipDestroyed,
      isGameOver: this.isGameOver,
      winner: this.winner,
    };
  }

  /**
   * Check if a shot hits a ship
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param isPlayerShot - True if checking enemy ships, false if checking player ships
   * @returns Object with hit status and ship ID if hit
   */
  public checkShot(
    x: number,
    y: number,
    isPlayerShot: boolean,
  ): { hit: boolean; shipId: number } {
    const shipPositions = isPlayerShot
      ? this.enemyShipPositions
      : this.playerShipPositions;
    const key = posKey(x, y);
    const shipId = shipPositions.get(key);

    if (shipId !== undefined) {
      return { hit: true, shipId };
    }

    return { hit: false, shipId: -1 };
  }

  /**
   * Check if a cell has already been shot at
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param isPlayerShot - True to check player shots, false for enemy shots
   * @returns True if cell was already shot
   */
  public isCellShot(x: number, y: number, isPlayerShot: boolean): boolean {
    const shotsMap = isPlayerShot ? this.playerShotsMap : this.enemyShotsMap;
    return shotsMap.has(posKey(x, y));
  }

  /**
   * Check if a ship is completely destroyed
   * @param shipId - ID of the ship to check
   * @param isPlayerShot - True if checking enemy ship, false for player ship
   * @returns True if all ship cells have been hit
   */
  public isShipDestroyed(shipId: number, isPlayerShot: boolean): boolean {
    const ships = isPlayerShot ? this.enemyShips : this.playerShips;
    if (shipId >= ships.length) return false;

    const hitsMap = isPlayerShot ? this.enemyShipHits : this.playerShipHits;
    const sizesMap = isPlayerShot ? this.enemyShipSizes : this.playerShipSizes;

    const hits = hitsMap.get(shipId) || 0;
    const size = sizesMap.get(shipId);

    return size !== undefined && hits === size;
  }

  /**
   * Check if all ships of a player are destroyed
   * @param isPlayerShips - True to check player ships, false for enemy ships
   * @returns True if all ships are destroyed
   */
  private areAllShipsDestroyed(isPlayerShips: boolean): boolean {
    const ships = isPlayerShips ? this.playerShips : this.enemyShips;

    // If no ships, cannot be "all destroyed" - game shouldn't have started
    if (ships.length === 0) {
      return false;
    }

    return ships.every((_, shipId) =>
      this.isShipDestroyed(shipId, !isPlayerShips),
    );
  }

  /**
   * Check if the game is over and set winner
   * @private
   */
  private checkGameOver(): void {
    if (this.isGameOver) return;

    const areAllPlayerShipsDestroyed = this.areAllShipsDestroyed(true);
    const areAllEnemyShipsDestroyed = this.areAllShipsDestroyed(false);

    if (areAllPlayerShipsDestroyed || areAllEnemyShipsDestroyed) {
      this.winner = areAllPlayerShipsDestroyed ? "enemy" : "player";
      this.isGameOver = true;
      this.onGameOver?.(this.winner);
    }
  }

  /**
   * Cache ship positions for O(1) lookup
   * @private
   */
  private cacheShipPositions(
    ships: GameShip[],
    positionsMap: Map<PositionKey, number>,
    sizesMap: Map<number, number>,
  ): void {
    ships.forEach((ship, shipId) => {
      const cells = getShipCellsFromShip(ship);
      sizesMap.set(shipId, cells.length);

      cells.forEach(([x, y]) => {
        positionsMap.set(posKey(x, y), shipId);
      });
    });
  }

  /**
   * Set player's ships
   * @param ships - Array of player ships
   */
  public setPlayerShips(ships: GameShip[]): void {
    this.playerShips = ships;
    this.playerShipPositions.clear();
    this.playerShipSizes.clear();
    this.cacheShipPositions(
      ships,
      this.playerShipPositions,
      this.playerShipSizes,
    );
    this.notifyStateChange();
  }

  /**
   * Set enemy's ships
   * @param ships - Array of enemy ships
   */
  public setEnemyShips(ships: GameShip[]): void {
    this.enemyShips = ships;
    this.enemyShipPositions.clear();
    this.enemyShipSizes.clear();
    this.cacheShipPositions(
      ships,
      this.enemyShipPositions,
      this.enemyShipSizes,
    );
    this.notifyStateChange();
  }

  /**
   * Set all player shots (useful for replay)
   * @param shots - Array of player shots
   */
  public setPlayerShots(shots: Shot[]): void {
    this.playerShotsMap.clear();
    this.playerShipHits.clear();
    shots.forEach((shot) => {
      this.playerShotsMap.set(posKey(shot.x, shot.y), shot);
      if (shot.hit && shot.shipId !== undefined) {
        const currentHits = this.playerShipHits.get(shot.shipId) || 0;
        this.playerShipHits.set(shot.shipId, currentHits + 1);
      }
    });
    this.shotCount = this.playerShotsMap.size + this.enemyShotsMap.size;
    this.notifyStateChange();
  }

  /**
   * Set all enemy shots (useful for replay)
   * @param shots - Array of enemy shots
   */
  public setEnemyShots(shots: Shot[]): void {
    this.enemyShotsMap.clear();
    this.enemyShipHits.clear();
    shots.forEach((shot) => {
      this.enemyShotsMap.set(posKey(shot.x, shot.y), shot);
      if (shot.hit && shot.shipId !== undefined) {
        const currentHits = this.enemyShipHits.get(shot.shipId) || 0;
        this.enemyShipHits.set(shot.shipId, currentHits + 1);
      }
    });
    this.shotCount = this.playerShotsMap.size + this.enemyShotsMap.size;
    this.notifyStateChange();
  }

  /**
   * Get complete current game state
   * @returns Full game state including ships, shots, and game status
   */
  public getState(): GameEngineState {
    return {
      currentTurn: this.currentTurn,
      isPlayerTurn: this.isPlayerTurn(),
      isEnemyTurn: this.isEnemyTurn(),
      playerShips: [...this.playerShips],
      enemyShips: [...this.enemyShips],
      playerShots: Array.from(this.playerShotsMap.values()),
      enemyShots: Array.from(this.enemyShotsMap.values()),
      isGameOver: this.isGameOver,
      winner: this.winner,
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
      shotCount: this.shotCount,
    };
  }

  /**
   * Get player's ships
   * @returns Copy of player ships array
   */
  public getPlayerShips(): GameShip[] {
    return [...this.playerShips];
  }

  /**
   * Get enemy's ships
   * @returns Copy of enemy ships array
   */
  public getEnemyShips(): GameShip[] {
    return [...this.enemyShips];
  }

  /**
   * Get player's shots
   * @returns Array of player shots
   */
  public getPlayerShots(): Shot[] {
    return Array.from(this.playerShotsMap.values());
  }

  /**
   * Get enemy's shots
   * @returns Array of enemy shots
   */
  public getEnemyShots(): Shot[] {
    return Array.from(this.enemyShotsMap.values());
  }

  /**
   * Get total shot count
   * @returns Total number of shots fired by both players
   */
  public getShotCount(): number {
    return this.shotCount;
  }

  /**
   * Get the winner (if game is over)
   * @returns Winner ('player', 'enemy', or null if not over)
   */
  public getWinner(): Winner {
    return this.winner;
  }

  /**
   * Get board dimensions
   * @returns Object with width and height of the board
   */
  public getBoardDimensions(): { width: number; height: number } {
    return { width: this.boardWidth, height: this.boardHeight };
  }

  /**
   * Check if a position is valid on the board
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns True if position is within board boundaries
   */
  public isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
  }

  /**
   * Get shot at specific coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param isPlayerShot - True to check player shots, false for enemy shots
   * @returns Shot object if found, undefined otherwise
   */
  public getShotAtPosition(
    x: number,
    y: number,
    isPlayerShot: boolean,
  ): Shot | undefined {
    const shotsMap = isPlayerShot ? this.playerShotsMap : this.enemyShotsMap;
    return shotsMap.get(posKey(x, y));
  }

  /**
   * Check if there's a ship at specific coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param isPlayerShips - True to check player ships, false for enemy ships
   * @returns True if there's a ship at that position
   */
  public hasShipAtPosition(
    x: number,
    y: number,
    isPlayerShips: boolean,
  ): boolean {
    const positions = isPlayerShips
      ? this.playerShipPositions
      : this.enemyShipPositions;
    return positions.has(posKey(x, y));
  }

  /**
   * Notify state changes to observers
   * @private
   */
  private notifyStateChange(): void {
    this.onStateChange?.(this.getState());
  }
}

/**
 * Game engine state interface
 * Contains all game information at a point in time
 */
export interface GameEngineState {
  currentTurn: GameTurn;
  isPlayerTurn: boolean;
  isEnemyTurn: boolean;
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

/**
 * Shot result interface
 * Contains information about the outcome of a shot
 */
export interface ShotResult {
  success: boolean;
  error?: string;
  hit: boolean;
  shipId: number;
  shipDestroyed?: boolean;
  isGameOver?: boolean;
  winner?: Winner;
}

/**
 * Optional callbacks to observe engine changes
 * Useful for UI updates and event handling
 */
export interface GameEngineCallbacks {
  onStateChange?: (state: GameEngineState) => void;
  onTurnChange?: (turn: GameTurn) => void;
  onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  onGameOver?: (winner: Winner) => void;
}
