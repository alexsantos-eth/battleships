import { GameEngine, type GameEngineState, type ShotResult } from "./logic";
import type { GameShip, Winner, GameTurn } from "../types/common";
import type { GameConfig } from "../types/config";

/**
 * Match Rules Manager
 *
 * Implements the game match rules:
 * 1. If a shot hits (but doesn't destroy the ship), player can shoot again
 * 2. If a shot destroys the entire ship, turn ends
 * 3. Winner is determined when all enemy ships are destroyed
 *
 * This class wraps the GameEngine and enforces turn logic automatically.
 */
export class Match {
  private engine: GameEngine;
  private matchCallbacks?: MatchCallbacks;

  constructor(config?: Partial<GameConfig>, callbacks?: MatchCallbacks) {
    if (!config) {
      const initializer = new GameInitializer();
      config = initializer.getDefaultConfig();
    }

    this.matchCallbacks = callbacks;

    // Create engine with internal callbacks
    this.engine = new GameEngine(config, {
      onStateChange: (state) => {
        this.matchCallbacks?.onStateChange?.(state);
      },
      onTurnChange: (turn) => {
        this.matchCallbacks?.onTurnChange?.(turn);
      },
      onShot: (shot, isPlayerShot) => {
        this.matchCallbacks?.onShot?.(shot, isPlayerShot);
      },
      onGameOver: (winner) => {
        this.matchCallbacks?.onGameOver?.(winner);
      },
    });
  }

  /**
   * Initialize a new match with ships
   * @param playerShips - Player's ship placements
   * @param enemyShips - Enemy's ship placements
   * @param initialTurn - Who starts (defaults to PLAYER_TURN)
   */
  public initializeMatch(
    playerShips: GameShip[],
    enemyShips: GameShip[],
    initialTurn: GameTurn = "PLAYER_TURN",
  ): void {
    this.engine.initializeGame(playerShips, enemyShips, initialTurn);
    this.matchCallbacks?.onMatchStart?.();
  }

  /**
   * Execute a shot following match rules
   *
   * Rules applied:
   * - If miss: turn ends automatically
   * - If hit (but ship not destroyed): player can shoot again (turn continues)
   * - If hit (and ship destroyed): turn ends automatically
   * - Game over when all enemy ships destroyed
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param isPlayerShot - true for player, false for enemy
   * @returns Match result with turn information
   */
  public executeShot(
    x: number,
    y: number,
    isPlayerShot: boolean,
  ): MatchShotResult {
    // Execute the shot
    const shotResult = this.engine.executeShot(x, y, isPlayerShot);

    if (!shotResult.success) {
      return {
        ...shotResult,
        turnEnded: false,
        canShootAgain: false,
        reason: shotResult.error || "Shot failed",
      };
    }

    // Apply match rules
    let turnEnded = false;
    let canShootAgain = false;
    let reason = "";

    if (shotResult.isGameOver) {
      // Game over - match ends
      turnEnded = true;
      canShootAgain = false;
      reason = "Game over";
    } else if (shotResult.hit) {
      if (shotResult.shipDestroyed) {
        // Ship destroyed - turn ends
        turnEnded = true;
        canShootAgain = false;
        reason = "Ship destroyed - turn ends";
        this.engine.toggleTurn();
      } else {
        // Hit but ship not destroyed - can shoot again
        turnEnded = false;
        canShootAgain = true;
        reason = "Hit - shoot again";
      }
    } else {
      // Miss - turn ends
      turnEnded = true;
      canShootAgain = false;
      reason = "Miss - turn ends";
      this.engine.toggleTurn();
    }

    return {
      ...shotResult,
      turnEnded,
      canShootAgain,
      reason,
    };
  }

  /**
   * Check if it's the player's turn
   */
  public isPlayerTurn(): boolean {
    return this.engine.isPlayerTurn();
  }

  /**
   * Check if it's the enemy's turn
   */
  public isEnemyTurn(): boolean {
    return this.engine.isEnemyTurn();
  }

  /**
   * Get current turn
   */
  public getCurrentTurn(): GameTurn {
    return this.engine.getCurrentTurn();
  }

  /**
   * Get complete match state
   */
  public getState(): GameEngineState {
    return this.engine.getState();
  }

  /**
   * Get the underlying game engine (for advanced usage)
   */
  public getEngine(): GameEngine {
    return this.engine;
  }

  /**
   * Check if a cell has been shot
   */
  public isCellShot(x: number, y: number, isPlayerShot: boolean): boolean {
    return this.engine.isCellShot(x, y, isPlayerShot);
  }

  /**
   * Check if a position is valid
   */
  public isValidPosition(x: number, y: number): boolean {
    return this.engine.isValidPosition(x, y);
  }

  /**
   * Get the winner (if game is over)
   */
  public getWinner(): Winner {
    return this.engine.getWinner();
  }

  /**
   * Check if the match is over
   */
  public isMatchOver(): boolean {
    return this.engine.getState().isGameOver;
  }

  /**
   * Reset the match
   */
  public resetMatch(): void {
    this.engine.resetGame();
  }

  /**
   * Get board dimensions
   */
  public getBoardDimensions(): { width: number; height: number } {
    return this.engine.getBoardDimensions();
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
    return this.engine.getShotAtPosition(x, y, isPlayerShot);
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
    return this.engine.hasShipAtPosition(x, y, isPlayerShips);
  }
}

/**
 * Match shot result extends ShotResult with turn information
 */
export interface MatchShotResult extends ShotResult {
  turnEnded: boolean; // True if the turn ended with this shot
  canShootAgain: boolean; // True if player can shoot again
  reason: string; // Explanation of what happened
}

/**
 * Match callbacks for observing match events
 */
export interface MatchCallbacks {
  onStateChange?: (state: GameEngineState) => void;
  onTurnChange?: (turn: GameTurn) => void;
  onShot?: (shot: Shot, isPlayerShot: boolean) => void;
  onGameOver?: (winner: Winner) => void;
  onMatchStart?: () => void;
}

// Re-export Shot type for convenience
import type { Shot } from "../types/common";
import { GameInitializer } from "../manager";
