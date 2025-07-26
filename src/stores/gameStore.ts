import { create } from "zustand";

import { getRandomShips } from "@/components/ShipsPlane/utils";
import { eventBus, EVENTS } from "@/utils/eventBus";

export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

export type ShipVariant = "small" | "medium" | "large" | "xlarge";

export interface Ship {
  coords: [number, number];
  variant: ShipVariant;
  orientation: "horizontal" | "vertical";
}

export interface Shot {
  x: number;
  y: number;
  hit: boolean;
  shipId?: number;
}

export interface GameState {
  currentTurn: GameTurn;
  isPlayerTurn: boolean;
  isEnemyTurn: boolean;
  playerShips: Ship[];
  enemyShips: Ship[];
  playerShots: Shot[];
  enemyShots: Shot[];
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  toggleTurn: () => void;
  setPlayerShips: (ships: Ship[]) => void;
  setEnemyShips: (ships: Ship[]) => void;
  addPlayerShot: (shot: Shot) => void;
  addEnemyShot: (shot: Shot) => void;
  initializeGame: () => void;
  initializeRandomTurn: () => void;
  checkShot: (
    x: number,
    y: number,
    isPlayerShot: boolean
  ) => { hit: boolean; shipId?: number };
  isCellShot: (x: number, y: number, isPlayerShot: boolean) => boolean;
  isShipDestroyed: (shipId: number, isPlayerShot: boolean) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTurn: "PLAYER_TURN",
  isPlayerTurn: true,
  isEnemyTurn: false,
  playerShips: [],
  enemyShips: [],
  playerShots: [],
  enemyShots: [],

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
      eventBus.emit(EVENTS.CAMERA_SHOOT_END);
    } else {
      get().setPlayerTurn();
      eventBus.emit(EVENTS.CAMERA_SHOOT_START);
    }
  },

  setPlayerShips: (ships: Ship[]) => {
    set({ playerShips: ships });
  },

  setEnemyShips: (ships: Ship[]) => {
    set({ enemyShips: ships });
  },

  addPlayerShot: (shot: Shot) => {
    set((state) => ({
      playerShots: [...state.playerShots, shot],
    }));
  },

  addEnemyShot: (shot: Shot) => {
    set((state) => ({
      enemyShots: [...state.enemyShots, shot],
    }));
  },

  initializeRandomTurn: () => {
    const randomTurn = Math.random() < 0.5 ? "PLAYER_TURN" : "ENEMY_TURN";

    set({
      currentTurn: randomTurn,
      isPlayerTurn: randomTurn === "PLAYER_TURN",
      isEnemyTurn: randomTurn === "ENEMY_TURN",
    });
  },

  checkShot: (x: number, y: number, isPlayerShot: boolean) => {
    const ships = isPlayerShot ? get().enemyShips : get().playerShips;

    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipSize =
        ship.variant === "small"
          ? 2
          : ship.variant === "medium"
          ? 3
          : ship.variant === "large"
          ? 4
          : 5;

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

    return { hit: false };
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
    const shipSize =
      ship.variant === "small"
        ? 2
        : ship.variant === "medium"
        ? 3
        : ship.variant === "large"
        ? 4
        : 5;

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

  initializeGame: () => {
    if (get().playerShips.length === 0) {
      const playerShips = getRandomShips();
      set({ playerShips });
    }

    if (get().enemyShips.length === 0) {
      const enemyShips = getRandomShips();
      set({ enemyShips });
    }

    get().initializeRandomTurn();
  },
}));
