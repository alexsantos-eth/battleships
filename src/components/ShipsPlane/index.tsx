import { useMemo } from "react";

import Ship from "../Ship";

const GRID_SIZE = 10;

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getShipCells(
  x: number,
  y: number,
  size: number,
  orientation: "horizontal" | "vertical"
): [number, number][] {
  const cells: [number, number][] = [];
  if (orientation === "horizontal") {
    for (let i = 0; i < size; i++) {
      cells.push([x + i, y]);
    }
  } else {
    for (let i = 0; i < size; i++) {
      cells.push([x, y + i]);
    }
  }
  return cells;
}

function hasOverlap(
  newShipCells: [number, number][],
  placedShips: Array<{
    coords: [number, number];
    size: number;
    orientation: "horizontal" | "vertical";
  }>
): boolean {
  for (const placedShip of placedShips) {
    const placedCells = getShipCells(
      placedShip.coords[0],
      placedShip.coords[1],
      placedShip.size,
      placedShip.orientation
    );
    for (const newCell of newShipCells) {
      for (const placedCell of placedCells) {
        if (newCell[0] === placedCell[0] && newCell[1] === placedCell[1]) {
          return true;
        }
      }
    }
  }
  return false;
}

function getRandomShips() {
  const placedShips: Array<{
    coords: [number, number];
    size: number;
    orientation: "horizontal" | "vertical";
  }> = [];

  const shipDefinitions: Array<{
    variant: "small" | "large" | "house" | "house2";
    size: number;
  }> = [
    { variant: "small", size: 2 },
    { variant: "large", size: 3 },
    { variant: "large", size: 3 },
    { variant: "house", size: 5 },
    { variant: "house2", size: 4 },
  ];

  return shipDefinitions.map((shipDef) => {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;

    const orientation: "horizontal" | "vertical" =
      Math.random() < 0.5 ? "horizontal" : "vertical";

    do {
      if (orientation === "horizontal") {
        x = getRandomInt(0, GRID_SIZE - shipDef.size);
        y = getRandomInt(0, GRID_SIZE - 1);
      } else {
        x = getRandomInt(0, GRID_SIZE - 1);
        y = getRandomInt(0, GRID_SIZE - shipDef.size);
      }

      const newShipCells = getShipCells(x, y, shipDef.size, orientation);
      const hasConflict = hasOverlap(newShipCells, placedShips);

      if (!hasConflict) {
        placedShips.push({
          coords: [x, y],
          size: shipDef.size,
          orientation: orientation,
        });
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    return {
      coords: [x, y] as [number, number],
      variant: shipDef.variant,
      orientation: orientation,
    };
  });
}

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
