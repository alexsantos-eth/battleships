import { create } from "zustand";

import { GAME_CONSTANTS } from "@/constants/game/board";

import type { GameShip, Shot, Winner } from "@/types/game/common";
import type { GameSetup } from "@/game/manager/initializer";

export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

export type ShipVariant = "small" | "medium" | "large" | "xlarge";

export interface GameState {
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
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  toggleTurn: () => void;
  setPlayerShips: (ships: GameShip[]) => void;
  setEnemyShips: (ships: GameShip[]) => void;
  setBoardDimensions: (width: number, height: number) => void;
  addPlayerShot: (shot: Shot) => void;
  addEnemyShot: (shot: Shot) => void;
  incrementShotCount: () => void;
  getShotCount: () => number;
  initializeGame: (gameSetup: GameSetup) => void;
  checkShot: (
    x: number,
    y: number,
    isPlayerShot: boolean
  ) => { hit: boolean; shipId?: number };
  isCellShot: (x: number, y: number, isPlayerShot: boolean) => boolean;
  isShipDestroyed: (shipId: number, isPlayerShot: boolean) => boolean;
  checkGameOver: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTurn: "PLAYER_TURN",
  isPlayerTurn: true,
  isEnemyTurn: false,
  playerShips: [],
  enemyShips: [],
  playerShots: [],
  enemyShots: [],
  isGameOver: false,
  winner: null,
  boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
  boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
  shotCount: 0,

  setPlayerTurn: () => {
    set({
      currentTurn: "PLAYER_TURN",
      isPlayerTurn: true,
      isEnemyTurn: false,
    });
  },

  setEnemyTurn: () => {
    set({
      currentTurn: "ENEMY_TURN",
      isPlayerTurn: false,
      isEnemyTurn: true,
    });
  },

  toggleTurn: () => {
    const { currentTurn } = get();
    if (currentTurn === "PLAYER_TURN") {
      get().setEnemyTurn();
    } else {
      get().setPlayerTurn();
    }
  },

  setPlayerShips: (ships: GameShip[]) => {
    set({ playerShips: ships });
  },

  setEnemyShips: (ships: GameShip[]) => {
    set({ enemyShips: ships });
  },

  setBoardDimensions: (width: number, height: number) => {
    set({ boardWidth: width, boardHeight: height });
  },

  addPlayerShot: (shot: Shot) => {
    set((state) => ({
      playerShots: [...state.playerShots, shot],
      shotCount: state.shotCount + 1,
    }));
    get().checkGameOver();
  },

  addEnemyShot: (shot: Shot) => {
    set((state) => ({
      enemyShots: [...state.enemyShots, shot],
      shotCount: state.shotCount + 1,
    }));
    get().checkGameOver();
  },

  incrementShotCount: () => {
    set((state) => ({
      shotCount: state.shotCount + 1,
    }));
  },

  getShotCount: () => {
    return get().shotCount;
  },

  checkShot: (posX: number, posY: number, isPlayerShot: boolean) => {
    const x = isPlayerShot
      ? posX
      : GAME_CONSTANTS.BOARD.DEFAULT_WIDTH - 1 - posX;
    const y = isPlayerShot
      ? posY
      : GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT - 1 - posY;

    const ships = isPlayerShot ? get().enemyShips : get().playerShips;

    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipSize = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];

      const shipCells: [number, number][] = [];
      if (ship.orientation === "horizontal") {
        for (let j = 0; j < shipSize; j++) {
          shipCells.push([ship.coords[0] + j, ship.coords[1]]);
        }
      } else {
        for (let j = 0; j < shipSize; j++) {
          shipCells.push([ship.coords[0], ship.coords[1] + j]);
        }
      }

      for (const cell of shipCells) {
        if (cell[0] === x && cell[1] === y) {
          return { hit: true, shipId: i };
        }
      }
    }

    return { hit: false, shipId: -1 };
  },

  isCellShot: (x: number, y: number, isPlayerShot: boolean) => {
    const shots = isPlayerShot ? get().playerShots : get().enemyShots;
    return shots.some((shot) => shot.x === x && shot.y === y);
  },

  isShipDestroyed: (shipId: number, isPlayerShot: boolean) => {
    const ships = isPlayerShot ? get().enemyShips : get().playerShips;
    const shots = isPlayerShot ? get().playerShots : get().enemyShots;

    if (shipId >= ships.length) return false;

    const ship = ships[shipId];
    const shipSize = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];

    const shipCells: [number, number][] = [];
    if (ship.orientation === "horizontal") {
      for (let j = 0; j < shipSize; j++) {
        shipCells.push([ship.coords[0] + j, ship.coords[1]]);
      }
    } else {
      for (let j = 0; j < shipSize; j++) {
        shipCells.push([ship.coords[0], ship.coords[1] + j]);
      }
    }

    const hitCells = shots.filter((shot) => shot.hit && shot.shipId === shipId);
    return hitCells.length === shipCells.length;
  },

  checkGameOver: () => {
    const { playerShips, enemyShips } = get();

    const areAllPlayerShipsDestroyed = playerShips.every((_, shipId) =>
      get().isShipDestroyed(shipId, false)
    );

    const areAllEnemyShipsDestroyed = enemyShips.every((_, shipId) =>
      get().isShipDestroyed(shipId, true)
    );

    if (areAllPlayerShipsDestroyed || areAllEnemyShipsDestroyed) {
      const winner: Winner = areAllPlayerShipsDestroyed ? "enemy" : "player";
      set({
        isGameOver: true,
        winner,
      });
    }
  },

  resetGame: () => {
    set({
      currentTurn: "PLAYER_TURN",
      isPlayerTurn: true,
      isEnemyTurn: false,
      playerShips: [],
      enemyShips: [],
      playerShots: [],
      enemyShots: [],
      isGameOver: false,
      winner: null,
      boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
      boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
      shotCount: 0,
    });
  },

  initializeGame: (gameSetup: GameSetup) => {
    const newState = {
      playerShips: gameSetup.playerShips,
      enemyShips: gameSetup.enemyShips,
      boardWidth: gameSetup.config.boardWidth,
      boardHeight: gameSetup.config.boardHeight,
      currentTurn: gameSetup.initialTurn,
      isPlayerTurn: gameSetup.initialTurn === "PLAYER_TURN",
      isEnemyTurn: gameSetup.initialTurn === "ENEMY_TURN",
      playerShots: [],
      enemyShots: [],
      isGameOver: false,
      winner: null,
      shotCount: 0,
    };

    set(newState);
  },
}));
