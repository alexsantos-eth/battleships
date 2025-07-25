import { create } from "zustand";

export type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";

interface GameState {
  currentTurn: GameTurn;
  isPlayerTurn: boolean;
  isEnemyTurn: boolean;
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  toggleTurn: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTurn: "PLAYER_TURN",
  isPlayerTurn: true,
  isEnemyTurn: false,

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
})); 