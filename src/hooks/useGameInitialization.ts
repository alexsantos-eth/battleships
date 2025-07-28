import { useEffect } from "react";
import { useGameStore } from "@/stores/game";
import { useGameConfiguration } from "./useGameConfiguration";

export const useGameInitialization = () => {
  const { initializeGame } = useGameStore();
  const gameConfig = useGameConfiguration();

  useEffect(() => {
    gameConfig.initializeGameConfig(initializeGame);
  }, [gameConfig, initializeGame]);

  return gameConfig;
}; 