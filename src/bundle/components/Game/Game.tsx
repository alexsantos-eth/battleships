import React from "react";

import { GameGrid } from "@/bundle/components/GameGrid";
import EnvironmentBox from "@/bundle/env/Canvas/Canvas";

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
    rotation: [0, 0, Math.PI] as [number, number, number],
    position: [0, 12, 0] as [number, number, number],
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
