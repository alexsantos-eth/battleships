import { GAME_CONSTANTS } from "../constants/game";
import type { GameConfig, GameShip, GameTurn } from "../engine";
import { generateShips } from "../tools/ship/calculations";
import type { PlayerName } from "../types/common";

/**
 * Game setup configuration
 * Contains all initial values needed to start a game
 */
export interface GameSetup {
  /** Player's ship placements */
  playerShips: GameShip[];
  /** Enemy's ship placements */
  enemyShips: GameShip[];
  /** Who starts the game */
  initialTurn: GameTurn;
  /** Game configuration used */
  config: Partial<GameConfig>;
}

export type GAME_INITIAL_TURN = PlayerName | "random";

/**
 * Game Initializer
 *
 * Helps generate initial game values from a simple configuration.
 * Handles validation, default values, and ship generation.
 *
 * @example
 * ```typescript
 * const initializer = new GameInitializer({
 *   boardWidth: 10,
 *   boardHeight: 10,
 *   shipCounts: { small: 1, medium: 2, large: 1, xlarge: 1 }
 * });
 *
 * const setup = initializer.initializeGame();
 * // setup contains: playerShips, enemyShips, initialTurn, config
 * ```
 */
export class GameInitializer {
  private config: GameConfig;

  /**
   * Create a new game initializer
   * @param config - Partial game configuration (uses defaults for missing values)
   */
  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...this.getDefaultConfig(), ...config };
    this.validateConfig();
  }

  /**
   * Validate configuration values
   * @throws Error if configuration is invalid
   * @private
   */
  private validateConfig(): void {
    const { boardWidth, boardHeight, shipCounts } = this.config;

    if (
      boardWidth < GAME_CONSTANTS.BOARD.MIN_SIZE ||
      boardWidth > GAME_CONSTANTS.BOARD.MAX_SIZE
    ) {
      throw new Error(
        `Board width must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`,
      );
    }

    if (
      boardHeight < GAME_CONSTANTS.BOARD.MIN_SIZE ||
      boardHeight > GAME_CONSTANTS.BOARD.MAX_SIZE
    ) {
      throw new Error(
        `Board height must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`,
      );
    }

    const totalShips = Object.values(shipCounts).reduce(
      (sum, count) => sum + count,
      0,
    );
    const maxPossibleShips = Math.floor((boardWidth * boardHeight) / 4);

    if (totalShips > maxPossibleShips) {
      throw new Error(
        `Too many ships for board size. Maximum possible: ${maxPossibleShips}`,
      );
    }
  }

  /**
   * Get default game configuration
   * @returns Complete default configuration
   */
  public getDefaultConfig(): GameConfig {
    return {
      boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
      boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
      shipCounts: GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS,
      initialTurn: "random",
    };
  }

  /**
   * Determine initial turn based on configuration
   * @returns GameTurn value
   * @private
   */
  private determineInitialTurn(): GameTurn {
    switch (this.config.initialTurn) {
      case "player":
        return "PLAYER_TURN";
      case "enemy":
        return "ENEMY_TURN";
      case "random":
      default:
        return Math.random() <
          GAME_CONSTANTS.GAME_LOGIC.BATTLE.RANDOM_TURN_THRESHOLD
          ? "PLAYER_TURN"
          : "ENEMY_TURN";
    }
  }

  /**
   * Initialize a new game with all required values
   *
   * @param startTurn - Override initial turn ('player', 'enemy', or 'random')
   * @param ships - Provide custom ship placements (optional, will generate if not provided)
   * @returns Complete game setup ready to use
   *
   * @example
   * ```typescript
   * // Simple initialization
   * const setup = initializer.initializeGame();
   *
   * // With custom turn
   * const setup = initializer.initializeGame('player');
   *
   * // With custom ships
   * const customShips = {
   *   playerShips: generateShips(config),
   *   enemyShips: generateShips(config)
   * };
   * const setup = initializer.initializeGame('random', customShips);
   * ```
   */
  public initializeGame(
    startTurn?: GAME_INITIAL_TURN,
    ships?: { playerShips: GameShip[]; enemyShips: GameShip[] },
  ): GameSetup {
    const playerShips = ships?.playerShips ?? generateShips(this.config);
    const enemyShips = ships?.enemyShips ?? generateShips(this.config);

    const nexTurn: GameTurn | undefined =
      startTurn === "player"
        ? "PLAYER_TURN"
        : startTurn === "enemy"
          ? "ENEMY_TURN"
          : undefined;
    let initialTurn: GameTurn;

    if (!nexTurn) {
      initialTurn = this.determineInitialTurn();
    } else {
      initialTurn = nexTurn;
    }

    return {
      playerShips,
      enemyShips,
      initialTurn,
      config: this.config,
    };
  }
}
