import { create } from "zustand";

import { GAME_CONSTANTS } from "@/constants/game/board";
import { GameEngine } from "@/game/engine/GameEngine";

import type { GameShip, Shot, Winner } from "@/types/game/common";
import type { GameSetup } from "@/game/manager/initializer";

export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

export type ShipVariant = "small" | "medium" | "large" | "xlarge";

export interface GameState {
  // Engine interno (privado, no expuesto a componentes)
  _engine: GameEngine;
  
  // Estado (derivado del engine)
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
  
  // Acciones (delegan al engine)
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  toggleTurn: () => void;
  setPlayerShips: (ships: GameShip[]) => void;
  setEnemyShips: (ships: GameShip[]) => void;
  setBoardDimensions: (width: number, height: number) => void;
  addPlayerShot: (shot: Shot) => void;
  addEnemyShot: (shot: Shot) => void;
  setEnemyShots: (shots: Shot[]) => void;
  setPlayerShots: (shots: Shot[]) => void;
  incrementShotCount: () => void;
  getShotCount: () => number;
  initializeGame: (gameSetup: GameSetup) => void;
  checkShot: (
    x: number,
    y: number,
    isPlayerShot: boolean
  ) => { hit: boolean; shipId?: number; variant: ShipVariant };
  isCellShot: (x: number, y: number, isPlayerShot: boolean) => boolean;
  isShipDestroyed: (shipId: number, isPlayerShot: boolean) => boolean;
  checkGameOver: () => void;
  resetGame: () => void;
}

/**
 * Sincroniza el estado de Zustand con el estado del engine
 */
function syncStateFromEngine(engine: GameEngine): Partial<GameState> {
  const engineState = engine.getState();
  
  return {
    currentTurn: engineState.currentTurn,
    isPlayerTurn: engineState.isPlayerTurn,
    isEnemyTurn: engineState.isEnemyTurn,
    playerShips: engineState.playerShips,
    enemyShips: engineState.enemyShips,
    playerShots: engineState.playerShots,
    enemyShots: engineState.enemyShots,
    isGameOver: engineState.isGameOver,
    winner: engineState.winner,
    boardWidth: engineState.boardWidth,
    boardHeight: engineState.boardHeight,
    shotCount: engineState.shotCount,
  };
}

export const useGameStore = create<GameState>((set, get) => {
  // Crear la instancia del engine con callbacks para sincronizar
  const engine = new GameEngine(
    {
      boardWidth: GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
      boardHeight: GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
    },
    {
      // Callback para sincronizar automáticamente el estado
      onStateChange: () => {
        set(syncStateFromEngine(get()._engine));
      },
    }
  );

  return {
    _engine: engine,
    
    // Estado inicial
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
      get()._engine.setPlayerTurn();
    },

    setEnemyTurn: () => {
      get()._engine.setEnemyTurn();
    },

    toggleTurn: () => {
      get()._engine.toggleTurn();
    },

    setEnemyShots: (shots: Shot[]) => {
      get()._engine.setEnemyShots(shots);
    },

    setPlayerShots: (shots: Shot[]) => {
      get()._engine.setPlayerShots(shots);
    },

    setPlayerShips: (ships: GameShip[]) => {
      get()._engine.setPlayerShips(ships);
    },

    setEnemyShips: (ships: GameShip[]) => {
      get()._engine.setEnemyShips(ships);
    },

    setBoardDimensions: (width: number, height: number) => {
      get()._engine.setBoardDimensions(width, height);
    },

    addPlayerShot: (shot: Shot) => {
      get()._engine.executeShot(shot.x, shot.y, true);
      // El estado ya fue sincronizado por el callback
    },

    addEnemyShot: (shot: Shot) => {
      get()._engine.executeShot(shot.x, shot.y, false);
      // El estado ya fue sincronizado por el callback
    },

    incrementShotCount: () => {
      // Este método ya no es necesario, el engine maneja el conteo
      // Mantenido por compatibilidad
    },

    getShotCount: () => {
      return get()._engine.getShotCount();
    },

    checkShot: (posX: number, posY: number, isPlayerShot: boolean) => {
      const x = isPlayerShot
        ? posX
        : GAME_CONSTANTS.BOARD.DEFAULT_WIDTH - 1 - posX;
      const y = isPlayerShot
        ? posY
        : GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT - 1 - posY;

      const result = get()._engine.checkShot(x, y, isPlayerShot);
      
      const ships = isPlayerShot ? get().enemyShips : get().playerShips;
      const variant = result.shipId >= 0 && result.shipId < ships.length
        ? ships[result.shipId].variant
        : "small";

      return { 
        hit: result.hit, 
        shipId: result.shipId >= 0 ? result.shipId : undefined,
        variant: variant as ShipVariant
      };
    },

    isCellShot: (x: number, y: number, isPlayerShot: boolean) => {
      return get()._engine.isCellShot(x, y, isPlayerShot);
    },

    isShipDestroyed: (shipId: number, isPlayerShot: boolean) => {
      return get()._engine.isShipDestroyed(shipId, isPlayerShot);
    },

    checkGameOver: () => {
      // El engine maneja esto automáticamente en executeShot
      // Mantenido por compatibilidad
    },

    resetGame: () => {
      get()._engine.resetGame();
    },

    initializeGame: (gameSetup: GameSetup) => {
      const { _engine } = get();
      
      _engine.setBoardDimensions(
        gameSetup.config.boardWidth || GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
        gameSetup.config.boardHeight || GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT
      );
      
      _engine.initializeGame(
        gameSetup.playerShips,
        gameSetup.enemyShips,
        gameSetup.initialTurn
      );
    },
  };
});
