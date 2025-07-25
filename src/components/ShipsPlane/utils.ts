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

function isTooClose(
  newShipCells: [number, number][],
  placedShips: Array<{
    coords: [number, number];
    size: number;
    orientation: "horizontal" | "vertical";
  }>,
  minDistance: number = 2
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
        const distance = Math.max(
          Math.abs(newCell[0] - placedCell[0]),
          Math.abs(newCell[1] - placedCell[1])
        );
        if (distance <= minDistance) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getRandomShips() {
  const placedShips: Array<{
    coords: [number, number];
    size: number;
    orientation: "horizontal" | "vertical";
  }> = [];

  const shipDefinitions: Array<{
    variant: "small" | "medium" | "large" | "xlarge";
    size: number;
  }> = [
    { variant: "small", size: 2 },
    { variant: "medium", size: 3 },
    { variant: "medium", size: 3 },
    { variant: "large", size: 4 },
    { variant: "xlarge", size: 5 },
  ];

  const quadrantPreferences = [
    [0, 1],
    [2, 3],
    [1, 2],
    [0, 3],
    [1, 0],
  ];

  return shipDefinitions.map((shipDef, index) => {
    let x, y;
    let attempts = 0;
    const maxAttempts = 200;
    const preferredQuadrants = quadrantPreferences[index];

    const orientation: "horizontal" | "vertical" =
      Math.random() < 0.5 ? "horizontal" : "vertical";

    do {
      if (Math.random() < 0.7 && placedShips.length > 0) {
        const targetQuadrant = preferredQuadrants[Math.floor(Math.random() * preferredQuadrants.length)];
        
        const quadrantBounds = [
          { xMin: 0, xMax: Math.floor(GRID_SIZE / 2) - 1, yMin: 0, yMax: Math.floor(GRID_SIZE / 2) - 1 },
          { xMin: Math.floor(GRID_SIZE / 2), xMax: GRID_SIZE - 1, yMin: 0, yMax: Math.floor(GRID_SIZE / 2) - 1 },
          { xMin: 0, xMax: Math.floor(GRID_SIZE / 2) - 1, yMin: Math.floor(GRID_SIZE / 2), yMax: GRID_SIZE - 1 },
          { xMin: Math.floor(GRID_SIZE / 2), xMax: GRID_SIZE - 1, yMin: Math.floor(GRID_SIZE / 2), yMax: GRID_SIZE - 1 },
        ];
        
        const bounds = quadrantBounds[targetQuadrant];
        
        if (orientation === "horizontal") {
          x = getRandomInt(bounds.xMin, Math.min(bounds.xMax, GRID_SIZE - shipDef.size));
          y = getRandomInt(bounds.yMin, bounds.yMax);
        } else {
          x = getRandomInt(bounds.xMin, bounds.xMax);
          y = getRandomInt(bounds.yMin, Math.min(bounds.yMax, GRID_SIZE - shipDef.size));
        }
      } else {
        if (orientation === "horizontal") {
          x = getRandomInt(0, GRID_SIZE - shipDef.size);
          y = getRandomInt(0, GRID_SIZE - 1);
        } else {
          x = getRandomInt(0, GRID_SIZE - 1);
          y = getRandomInt(0, GRID_SIZE - shipDef.size);
        }
      }

      const newShipCells = getShipCells(x, y, shipDef.size, orientation);
      const hasConflict = hasOverlap(newShipCells, placedShips);
      const tooClose = isTooClose(newShipCells, placedShips, 1);

      if (!hasConflict && !tooClose) {
        placedShips.push({
          coords: [x, y],
          size: shipDef.size,
          orientation: orientation,
        });
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      let fallbackAttempts = 0;
      const maxFallbackAttempts = 50;
      
      while (fallbackAttempts < maxFallbackAttempts) {
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
        fallbackAttempts++;
      }
    }

    return {
      coords: [x, y] as [number, number],
      variant: shipDef.variant,
      orientation: orientation,
    };
  });
}
