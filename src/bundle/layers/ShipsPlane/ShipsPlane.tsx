import React from "react";

import { Ship } from "@/bundle/primitives";
import { useGameStore } from "@/bundle/stores/game/gameStore";

import type { GameShip } from "@/types/game/common";
import type { ShipsPlaneProps } from "./ShipsPlane.types";

export const ShipsPlane: React.FC<ShipsPlaneProps> = ({ isPlayerBoard }) => {
  const { playerShips, enemyShips } = useGameStore();

  const ships = isPlayerBoard ? playerShips : enemyShips;

  return (
    <group>
      {ships.map((ship: GameShip, idx) => (
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
