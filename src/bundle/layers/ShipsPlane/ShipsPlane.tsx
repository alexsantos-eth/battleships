import React from "react";

import { Ship } from "@/bundle/primitives";
import { useGameStore } from "@/bundle/stores/game/gameStore";

import type { GameShip } from "@/types/game/common";

export const ShipsPlane: React.FC = () => {
  const { playerShips } = useGameStore();

  return (
    <group>
      {playerShips.map((ship: GameShip, idx) => (
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
