import React from "react";

import { Cell } from "@/bundle/components/Cell";
import { useCellPositions } from "@/bundle/hooks/grid/useCellPositions";

import type { EnemyShotsGridProps } from "./EnemyShotsGrid.types";

export const EnemyShotsGrid: React.FC<EnemyShotsGridProps> = () => {
  const { cells } = useCellPositions(false);

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
