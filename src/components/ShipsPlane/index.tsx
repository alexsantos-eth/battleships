import { useMemo } from "react";

import Ship from "@/components/Ship";
import { useGameState } from "@/hooks/useGameState";

import type { Ship as ShipType } from "@/stores/gameStore";
interface ShipsPlaneProps {
  isPlayerBoard?: boolean;
  alwaysShowEnemyShips?: boolean;
}

const ShipsPlane = ({ isPlayerBoard = true, alwaysShowEnemyShips = false }: ShipsPlaneProps) => {
  const { playerShips, enemyShips, initializeGame, currentTurn } = useGameState();

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

export default ShipsPlane;
