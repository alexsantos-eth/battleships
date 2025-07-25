import { useEffect, useRef, useState } from "react";

import Cell from "@/components/Cell";
import WaterExplosion from "@/components/WaterExplosion";
import { useGameStore } from "@/stores/gameStore";
import { eventBus, EVENTS } from "@/utils/eventBus";
import { useGridDimensions } from "@/hooks/useGridDimensions";

interface Explosion {
  id: number;
  pos: [number, number, number];
}

const PressGrid: React.FC = () => {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const lastTurn = useRef<string>("");

  const {
    currentTurn,
    isPlayerTurn,
    checkShot,
    addPlayerShot,
    isCellShot,
    isShipDestroyed,
    setEnemyTurn,
  } = useGameStore();

  const {
    boardWidth,
    boardHeight,
    worldToGridCoordinates,
    gridToWorldCoordinates,
    isValidGridPosition,
  } = useGridDimensions();

  useEffect(() => {
    if (currentTurn === "PLAYER_TURN" && lastTurn.current === "ENEMY_TURN") {
      eventBus.emit(EVENTS.CAMERA_SHOOT_START, {
        newRotation: 0,
        targetDistance: 5,
      });
    }
    lastTurn.current = currentTurn;
  }, [currentTurn]);

  const handleClick = (pos: [number, number, number]) => {
    if (!isPlayerTurn) return;

    const [gridX, gridY] = worldToGridCoordinates(pos);

    if (!isValidGridPosition(gridX, gridY)) return;
    if (isCellShot(gridX, gridY, true)) return;

    const { hit, shipId } = checkShot(gridX, gridY, true);

    const shot = {
      x: gridX,
      y: gridY,
      hit,
      shipId,
    };

    addPlayerShot(shot);

    const id = Date.now();
    setExplosions((prev) => [...prev, { id, pos }]);

    if (hit) {
      const shipDestroyed =
        shipId !== undefined && isShipDestroyed(shipId, true);
      if (shipDestroyed) {
        setEnemyTurn();
        eventBus.emit(EVENTS.CAMERA_SHOOT_END, {
          newRotation: 0,
          targetDistance: 5,
        });
      }
    } else {
      setEnemyTurn();
      eventBus.emit(EVENTS.CAMERA_SHOOT_END, {
        newRotation: 0,
        targetDistance: 5,
      });
    }
  };

  const cells = [];
  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      const [posX, posY] = gridToWorldCoordinates(x, y);

      const isShot = isCellShot(x, y, true);
      const shot = useGameStore
        .getState()
        .playerShots.find((s) => s.x === x && s.y === y);
      const isHit = shot?.hit || false;

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={[posX, posY, 0]}
          onClick={handleClick}
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

export default PressGrid;
