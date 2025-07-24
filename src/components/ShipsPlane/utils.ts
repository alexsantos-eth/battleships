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
    variant: "small" | "large" | "large2" | "house" | "house2";
    size: number;
  }> = [
    { variant: "small", size: 2 },
    { variant: "large", size: 3 },
    { variant: "large2", size: 3 },
    { variant: "house", size: 5 },
    { variant: "house2", size: 4 },
  ];

  // Define preferred quadrants for each ship to ensure dispersion
  const quadrantPreferences = [
    [0, 1], // small: top-left or top-right
    [2, 3], // large: bottom-left or bottom-right
    [1, 2], // large2: top-right or bottom-left
    [0, 3], // house: top-left or bottom-right
    [1, 0], // house2: top-right or top-left
  ];

  return shipDefinitions.map((shipDef, index) => {
    let x, y;
    let attempts = 0;
    const maxAttempts = 200; // Increased attempts for better distribution
    const preferredQuadrants = quadrantPreferences[index];

    const orientation: "horizontal" | "vertical" =
      Math.random() < 0.5 ? "horizontal" : "vertical";

    do {
      // 70% chance to use preferred quadrants, 30% chance for random placement
      if (Math.random() < 0.7 && placedShips.length > 0) {
        const targetQuadrant = preferredQuadrants[Math.floor(Math.random() * preferredQuadrants.length)];
        
        // Define bounds for each quadrant
        const quadrantBounds = [
          { xMin: 0, xMax: Math.floor(GRID_SIZE / 2) - 1, yMin: 0, yMax: Math.floor(GRID_SIZE / 2) - 1 }, // 0: top-left
          { xMin: Math.floor(GRID_SIZE / 2), xMax: GRID_SIZE - 1, yMin: 0, yMax: Math.floor(GRID_SIZE / 2) - 1 }, // 1: top-right
          { xMin: 0, xMax: Math.floor(GRID_SIZE / 2) - 1, yMin: Math.floor(GRID_SIZE / 2), yMax: GRID_SIZE - 1 }, // 2: bottom-left
          { xMin: Math.floor(GRID_SIZE / 2), xMax: GRID_SIZE - 1, yMin: Math.floor(GRID_SIZE / 2), yMax: GRID_SIZE - 1 }, // 3: bottom-right
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
        // Random placement across the entire grid
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
      const tooClose = isTooClose(newShipCells, placedShips, 1); // Minimum 1 cell distance

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

    // Fallback: if we can't find a good position, just place it anywhere without overlap
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
