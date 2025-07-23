import { useMemo } from "react";

import Ship from "../Ship";
import { getRandomShips } from "./utils";

const ShipsPlane = () => {
  const ships = useMemo(() => getRandomShips(), []);
  return (
    <group>
      {ships.map((ship, idx) => (
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
