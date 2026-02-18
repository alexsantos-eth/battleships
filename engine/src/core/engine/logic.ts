import { GAME_CONSTANTS } from "../constants/game";
import { getShipCellsFromShip } from "../tools/ship/calculations";
import type { GameShip, Shot, Winner, GameTurn } from "../types/common";
import type { GameConfig } from "../types/config";

export class GameEngine {
  // Game state
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
  
  // Optional callbacks to observe changes
  private onStateChange?: (state: GameEngineState) => void;
  private onTurnChange?: (turn: GameTurn) => void;
  private onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  private onGameOver?: (winner: Winner) => void;

  constructor(config: Partial<GameConfig> = {}, callbacks?: GameEngineCallbacks) {
    this.boardWidth = config.boardWidth ?? GAME_CONSTANTS.BOARD.DEFAULT_WIDTH;
    this.boardHeight = config.boardHeight ?? GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT;
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

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
  public initializeGame(playerShips: GameShip[], enemyShips: GameShip[], initialTurn: GameTurn = "PLAYER_TURN"): void {
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

  /**
   * Reset the game to initial state
   */
  public resetGame(): void {
    this.currentTurn = "PLAYER_TURN";
    this.playerShips = [];
    this.enemyShips = [];
    this.playerShots = [];
    this.enemyShots = [];
    this.isGameOver = false;
    this.winner = null;
    this.shotCount = 0;

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

    if (isPlayerShot) {
      this.playerShots.push(shot);
    } else {
      this.enemyShots.push(shot);
    }

    this.shotCount++;
    this.onShot?.(shot, isPlayerShot);
    this.checkGameOver();

    const shipDestroyed = result.hit && result.shipId >= 0 
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
  public checkShot(x: number, y: number, isPlayerShot: boolean): { hit: boolean; shipId: number } {
    const ships = isPlayerShot ? this.enemyShips : this.playerShips;

    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipCells = getShipCellsFromShip(ship);

      for (const [cellX, cellY] of shipCells) {
        if (cellX === x && cellY === y) {
          return { hit: true, shipId: i };
        }
      }
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
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;
    return shots.some((shot) => shot.x === x && shot.y === y);
  }

  /**
   * Check if a ship is completely destroyed
   * @param shipId - ID of the ship to check
   * @param isPlayerShot - True if checking enemy ship, false for player ship
   * @returns True if all ship cells have been hit
   */
  public isShipDestroyed(shipId: number, isPlayerShot: boolean): boolean {
    const ships = isPlayerShot ? this.enemyShips : this.playerShips;
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;

    if (shipId >= ships.length) return false;

    const ship = ships[shipId];
    const shipCells = getShipCellsFromShip(ship);
    const hitCells = shots.filter((shot) => shot.hit && shot.shipId === shipId);

    return hitCells.length === shipCells.length;
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
    
    return ships.every((_, shipId) => this.isShipDestroyed(shipId, !isPlayerShips));
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
   * Set player's ships
   * @param ships - Array of player ships
   */
  public setPlayerShips(ships: GameShip[]): void {
    this.playerShips = ships;
    this.notifyStateChange();
  }

  /**
   * Set enemy's ships
   * @param ships - Array of enemy ships
   */
  public setEnemyShips(ships: GameShip[]): void {
    this.enemyShips = ships;
    this.notifyStateChange();
  }

  /**
   * Set all player shots (useful for replay)
   * @param shots - Array of player shots
   */
  public setPlayerShots(shots: Shot[]): void {
    this.playerShots = shots;
    this.notifyStateChange();
  }

  /**
   * Set all enemy shots (useful for replay)
   * @param shots - Array of enemy shots
   */
  public setEnemyShots(shots: Shot[]): void {
    this.enemyShots = shots;
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
      playerShots: [...this.playerShots],
      enemyShots: [...this.enemyShots],
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
   * @returns Copy of player shots array
   */
  public getPlayerShots(): Shot[] {
    return [...this.playerShots];
  }

  /**
   * Get enemy's shots
   * @returns Copy of enemy shots array
   */
  public getEnemyShots(): Shot[] {
    return [...this.enemyShots];
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
  public getShotAtPosition(x: number, y: number, isPlayerShot: boolean): Shot | undefined {
    const shots = isPlayerShot ? this.playerShots : this.enemyShots;
    return shots.find(shot => shot.x === x && shot.y === y);
  }

  /**
   * Check if there's a ship at specific coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param isPlayerShips - True to check player ships, false for enemy ships
   * @returns True if there's a ship at that position
   */
  public hasShipAtPosition(x: number, y: number, isPlayerShips: boolean): boolean {
    const ships = isPlayerShips ? this.playerShips : this.enemyShips;
    
    for (const ship of ships) {
      const shipCells = getShipCellsFromShip(ship);
      for (const [cellX, cellY] of shipCells) {
        if (cellX === x && cellY === y) {
          return true;
        }
      }
    }
    
    return false;
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
