import { useMemo } from "react";

import Ship from "@/components/Ship";
import { useGameState } from "@/hooks/useGameState";

import type { Ship as ShipType } from "@/stores/gameStore";
interface ShipsPlaneProps {
  isPlayerBoard?: boolean;
}

const ShipsPlane = ({ isPlayerBoard = true }: ShipsPlaneProps) => {
  const { playerShips, enemyShips, initializeGame } = useGameState();

  const ships = useMemo(() => {
    const currentShips = isPlayerBoard ? playerShips : enemyShips;

    if (currentShips.length === 0) {
      initializeGame();
      return [];
    }

    return currentShips;
  }, [isPlayerBoard, playerShips, enemyShips, initializeGame]);

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
