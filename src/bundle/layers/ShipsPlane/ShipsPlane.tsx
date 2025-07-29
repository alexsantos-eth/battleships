import React, { useMemo } from "react";

import { useGameState } from "@/bundle/hooks/game/useGameState";
import { Ship } from "@/bundle/primitives";

import type { Ship as ShipType } from "@/bundle/stores/game/gameStore";
import type { ShipsPlaneProps } from "./ShipsPlane.types";
export const ShipsPlane: React.FC<ShipsPlaneProps> = ({
  isPlayerBoard = true,
  alwaysShowEnemyShips = false,
}) => {
  const { playerShips, enemyShips, initializeGame, currentTurn } =
    useGameState();

  const ships = useMemo(() => {
    const currentShips = isPlayerBoard ? playerShips : enemyShips;

    if (!currentShips || currentShips.length === 0) {
      initializeGame();
      return [];
    }

    return currentShips;
  }, [isPlayerBoard, playerShips, enemyShips, initializeGame]);

  const shouldShowShips = useMemo(() => {
    if (!isPlayerBoard) {
      return currentTurn === "ENEMY_TURN" || alwaysShowEnemyShips;
    }
    return true;
  }, [isPlayerBoard, currentTurn, alwaysShowEnemyShips]);

  if (!shouldShowShips) {
    return null;
  }

  return (
    <group>
      {ships.map((ship: ShipType, idx) => (
        <Ship
          key={idx}
          coords={ship.coords}
          variant={ship.variant}
          orientation={ship.orientation}
        />
      ))}
    </group>
  );
};
