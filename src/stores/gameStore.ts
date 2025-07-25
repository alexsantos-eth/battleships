import { create } from "zustand";
import { getRandomShips } from "../components/ShipsPlane/utils";

export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

export type ShipVariant = "small" | "medium" | "large" | "xlarge";

export interface Ship {
  coords: [number, number];
  variant: ShipVariant;
  orientation: "horizontal" | "vertical";
}

export interface GameState {
  currentTurn: GameTurn;
  isPlayerTurn: boolean;
  isEnemyTurn: boolean;
  playerShips: Ship[];
  enemyShips: Ship[];
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  toggleTurn: () => void;
  setPlayerShips: (ships: Ship[]) => void;
  setEnemyShips: (ships: Ship[]) => void;
  initializeGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTurn: "PLAYER_TURN",
  isPlayerTurn: true,
  isEnemyTurn: false,
  playerShips: [],
  enemyShips: [],

  setPlayerTurn: () => {
    console.log("Game turn: PLAYER_TURN");
    set({
      currentTurn: "PLAYER_TURN",
      isPlayerTurn: true,
      isEnemyTurn: false,
    });
  },

  setEnemyTurn: () => {
    console.log("Game turn: ENEMY_TURN");
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

  setPlayerShips: (ships: Ship[]) => {
    set({ playerShips: ships });
  },

  setEnemyShips: (ships: Ship[]) => {
    set({ enemyShips: ships });
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
  },
})); 