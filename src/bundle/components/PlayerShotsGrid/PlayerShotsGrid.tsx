import React from "react";

import { Cell } from "@/bundle/components/Cell";
import { useCellPositions } from "@/bundle/hooks/grid/useCellPositions";

import type { PlayerShotsGridProps } from "./PlayerShotsGrid.types";
import { useGameStore } from "@/bundle/stores/game/gameStore";

export const PlayerShotsGrid: React.FC<PlayerShotsGridProps> = () => {
  const { cells } = useCellPositions(true);
  const { enemyShots } = useGameStore();
  console.log({ enemyShots });

  return (
    <>
      <group rotation={[0, 0, 0]} position={[0, 0, 0.2]}>
        {cells.map(({ x, y, position, isShot, isHit }) => (
          <Cell
            key={`${x}-${y}`}
            position={position}
            onClick={() => {}}
            isShot={isShot}
            isHit={isHit}
          />
        ))}
      </group>
    </>
  );
};
