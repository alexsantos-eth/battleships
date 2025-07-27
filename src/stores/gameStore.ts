import { create } from "zustand";

import { eventBus, EVENTS } from "@/utils/eventBus";
import { GameInitializer, type GameConfig } from "@/game/logic/gameInitializer";
import { GAME_CONSTANTS } from "@/utils/constants";

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
  isGameOver: boolean;
  winner: "player" | "enemy" | null;
  boardWidth: number;
  boardHeight: number;
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  toggleTurn: () => void;
  setPlayerShips: (ships: Ship[]) => void;
  setEnemyShips: (ships: Ship[]) => void;
  setBoardDimensions: (width: number, height: number) => void;
  addPlayerShot: (shot: Shot) => void;
  addEnemyShot: (shot: Shot) => void;
  initializeGame: (config?: Partial<GameConfig>) => void;
  initializeRandomTurn: () => void;
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

  setBoardDimensions: (width: number, height: number) => {
    set({ boardWidth: width, boardHeight: height });
  },

  addPlayerShot: (shot: Shot) => {
    set((state) => ({
      playerShots: [...state.playerShots, shot],
    }));
    get().checkGameOver();
  },

  addEnemyShot: (shot: Shot) => {
    set((state) => ({
      enemyShots: [...state.enemyShots, shot],
    }));
    get().checkGameOver();
  },

  initializeRandomTurn: () => {
    const randomTurn = Math.random() < GAME_CONSTANTS.GAME_LOGIC.BATTLE.RANDOM_TURN_THRESHOLD ? "PLAYER_TURN" : "ENEMY_TURN";

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
      const winner = areAllPlayerShipsDestroyed ? "enemy" : "player";
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
    });
  },

  initializeGame: (config?: Partial<GameConfig>) => {
    console.log("Store: Inicializando juego con configuración:", config);
    const gameConfig = config || GameInitializer.createClassicGameConfig();
    console.log("Store: Configuración final:", gameConfig);
    const initializer = new GameInitializer(gameConfig);
    const gameSetup = initializer.initializeGame();
    console.log("Store: Setup del juego:", gameSetup);
    
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
      winner: null
    };
    
    console.log("Store: Nuevo estado:", newState);
    set(newState);
  },
}));
