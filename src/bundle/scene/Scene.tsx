import { Game } from "@/bundle/components/Game";
import { useGameStore } from "../stores/game/gameStore";
import { useEffect } from "react";
import type { SceneProps } from "./Scene.types";
import { GameInitializer } from "@/game/manager/initializer";

let count = 0;

const GameScene: React.FC<SceneProps> = ({ gameSetup }) => {
  const { initializeGame } = useGameStore();

  useEffect(() => {
    if (count === 0) {
      const config = gameSetup?.config;
      const initializer = new GameInitializer(config);

      const gameIntializerSetup = initializer.initializeGame(
        config?.initialTurn,
        gameSetup?.playerShips && gameSetup?.enemyShips
          ? {
              playerShips: gameSetup?.playerShips ?? [],
              enemyShips: gameSetup?.enemyShips ?? [],
            }
          : undefined
      );

      initializeGame(gameIntializerSetup);
      count++;
    }

    return () => {
      count++;
    };
  }, []);

  return <Game />;
};

export default GameScene;
