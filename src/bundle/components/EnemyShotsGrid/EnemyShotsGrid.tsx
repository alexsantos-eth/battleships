import React from "react";

import { Cell } from "@/bundle/components/Cell";
import { useCellPositions } from "@/bundle/hooks/grid/useCellPositions";

import type { EnemyShotsGridProps } from "./EnemyShotsGrid.types";
export const EnemyShotsGrid: React.FC<EnemyShotsGridProps> = () => {
  const { cells } = useCellPositions(false);

  return (
    <>
      <group rotation={[0, 0, 0]} position={[0, 0, 0.206]}>
        {cells.map(({ x, y, position, isShot, isHit }) => {
          return (
            <Cell
              isHit={isHit}
              isShot={isShot}
              key={`${x}-${y}`}
              position={position}
            />
          );
        })}
      </group>
    </>
  );
};
