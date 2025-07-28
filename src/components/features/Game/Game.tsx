import React from "react";
import { GameGrid } from "@/components/features/GameGrid";
import EnvironmentBox from "@/env";
import type { GameProps } from "./Game.types";

export const Game: React.FC<GameProps> = ({
  showPlayerBoard = true,
  showEnemyBoard = true,
  playerBoardProps = {},
  enemyBoardProps = {},
  className,
}) => {
  const defaultEnemyBoardProps = {
    isPlayerBoard: false,
    enablePressGrid: true,
    rotation: [0, 0, Math.PI] as [number, number, number],
    position: [0, 9, 0] as [number, number, number],
    ...enemyBoardProps,
  };

  const defaultPlayerBoardProps = {
    isPlayerBoard: true,
    ...playerBoardProps,
  };

  return (
    <div className={className}>
      <EnvironmentBox>
        {showPlayerBoard && <GameGrid {...defaultPlayerBoardProps} />}
        {showEnemyBoard && <GameGrid {...defaultEnemyBoardProps} />}
      </EnvironmentBox>
    </div>
  );
};
