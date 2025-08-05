import React from "react";

import { Cell } from "@/bundle/components/Cell";
import { useCellPositions } from "@/bundle/hooks/grid/useCellPositions";

import type { PlayerShotsGridProps } from "./PlayerShotsGrid.types";
export const PlayerShotsGrid: React.FC<PlayerShotsGridProps> = () => {
  const { cells } = useCellPositions(true);

  return (
    <>
      <group rotation={[0, 0, 0]} position={[0, 0, 0.206]}>
        {cells.map(({ x, y, position, isShot, isHit }) => {
          return (
            <Cell
              key={`${x}-${y}`}
              position={position}
              onClick={() => {}}
              isShot={isShot}
              isHit={isHit}
            />
          );
        })}
      </group>
    </>
  );
};
