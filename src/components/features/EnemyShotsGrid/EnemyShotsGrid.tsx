import React, { useEffect, useRef, useState } from "react";

import { Cell } from "@/components/features/Cell";
import { WaterExplosion } from "@/components/features/WaterExplosion";
import { useGameStore } from "@/stores/game";
import { eventBus, EVENTS } from "@/utils/eventBus";
import { useGridDimensions } from "@/hooks/useGridDimensions";
import type { EnemyShotsGridProps, Explosion } from './EnemyShotsGrid.types';

export const EnemyShotsGrid: React.FC<EnemyShotsGridProps> = () => {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const lastTurn = useRef<string>("");

  const {
    currentTurn,
    isCellShot,
    enemyShots,
  } = useGameStore();

  const {
    boardWidth,
    boardHeight,
    gridToWorldCoordinates,
  } = useGridDimensions();

  useEffect(() => {
    if (currentTurn === "ENEMY_TURN" && lastTurn.current === "PLAYER_TURN") {
      eventBus.emit(EVENTS.CAMERA_SHOOT_END, {
        newRotation: 0,
        targetDistance: 5,
      });
    }
    lastTurn.current = currentTurn;
  }, [currentTurn]);

  const cells = [];
  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      const [posX, posY] = gridToWorldCoordinates(x, y);

      const isShot = isCellShot(x, y, false);
      const shot = enemyShots.find((s) => s.x === x && s.y === y);
      const isHit = shot?.hit || false;

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={[posX, posY, 0]}
          onClick={() => {}}
          isShot={isShot}
          isHit={isHit}
        />
      );
    }
  }

  return (
    <>
      <group rotation={[0, 0, 0]} position={[0, 0, 0.2]}>
        {cells}
      </group>

      <group rotation={[0, 0, 0]}>
        {explosions.map(({ id, pos }) => (
          <WaterExplosion
            key={id}
            position={[pos[0], pos[1]]}
            onDone={() =>
              setExplosions((prev) => prev.filter((e) => e.id !== id))
            }
          />
        ))}
      </group>
    </>
  );
};

 