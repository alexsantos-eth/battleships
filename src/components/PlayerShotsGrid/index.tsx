import { useEffect, useRef, useState } from "react";

import Cell from "@/components/Cell";
import WaterExplosion from "@/components/WaterExplosion";
import { useGameStore } from "@/stores/gameStore";
import { eventBus, EVENTS } from "@/utils/eventBus";
import {
  gridToWorldCoordinates,
} from "../PressGrid/utils";

interface Explosion {
  id: number;
  pos: [number, number, number];
}

const PlayerShotsGrid: React.FC = () => {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const lastTurn = useRef<string>("");

  const {
    currentTurn,
    isCellShot,
    playerShots,
  } = useGameStore();

  useEffect(() => {
    if (currentTurn === "PLAYER_TURN" && lastTurn.current === "ENEMY_TURN") {
      eventBus.emit(EVENTS.CAMERA_SHOOT_START, {
        newRotation: 0,
        targetDistance: 5,
      });
    }
    lastTurn.current = currentTurn;
  }, [currentTurn]);

  const cells = [];
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const [posX, posY] = gridToWorldCoordinates(x, y);

      const isShot = isCellShot(x, y, true);
      const shot = playerShots.find((s) => s.x === x && s.y === y);
      const isHit = shot?.hit || false;

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={[posX, posY, 0]}
          onClick={() => {}} // No click handler for display only
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

export default PlayerShotsGrid; 