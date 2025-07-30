import type { GameShip, GameTurn, PlayerName } from "@/types/game/common";
import { GAME_CONSTANTS } from "@/constants/game/board";
import { generateShips as generateShipsUtil } from "@/tools/ship/calculations";

import type { GameConfig } from "@/types/game/config";

export interface GameSetup {
  playerShips: GameShip[];
  enemyShips: GameShip[];
  initialTurn: GameTurn;
  config: GameConfig;
}

export class GameInitializer {
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...this.getDefaultConfig(), ...config };
    this.validateConfig();
  }

  private validateConfig(): void {
    const { boardWidth, boardHeight, shipCounts } = this.config;

    if (
      boardWidth < GAME_CONSTANTS.BOARD.MIN_SIZE ||
      boardWidth > GAME_CONSTANTS.BOARD.MAX_SIZE
    ) {
      throw new Error(
        `Board width must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`
      );
    }

    if (
      boardHeight < GAME_CONSTANTS.BOARD.MIN_SIZE ||
      boardHeight > GAME_CONSTANTS.BOARD.MAX_SIZE
    ) {
      throw new Error(
        `Board height must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`
      );
    }

    const totalShips = Object.values(shipCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    const maxPossibleShips = Math.floor((boardWidth * boardHeight) / 4);

    if (totalShips > maxPossibleShips) {
      throw new Error(
        `Too many ships for board size. Maximum possible: ${maxPossibleShips}`
      );
    }
  }

  public getDefaultConfig(): GameConfig {
    return {
      boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
      boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
      shipCounts: GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS,
      initialTurn: "random",
    };
  }

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

  public initializeGame(
    startTurn?: PlayerName | "random",
    ships?: { playerShips: GameShip[]; enemyShips: GameShip[] }
  ): GameSetup {
    const playerShips = ships?.playerShips ?? generateShipsUtil(this.config);
    const enemyShips = ships?.enemyShips ?? generateShipsUtil(this.config);

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
