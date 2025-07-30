import { Game } from "@/bundle/components/Game";
import { useGameStore } from "../stores/game/gameStore";
import { useEffect } from "react";
import type { SceneProps } from "./Scene.types";

let count = 0;

const GameScene: React.FC<SceneProps> = ({ config }) => {
  const { initializeGame } = useGameStore();
  useEffect(() => {
    if (count === 0) {
      initializeGame(config);
      count++;
    }

    return () => {
      count++;
    };
  }, []);

  return <Game />;
};

export default GameScene;
