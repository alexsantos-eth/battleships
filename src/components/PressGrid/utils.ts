export const GRID_SPACING = 0.5;
export const GRID_SIZE = 10;

export const worldToGridCoordinates = (pos: [number, number, number]): [number, number] => {
  const gridX = Math.round(
    (pos[0] + (GRID_SPACING * GRID_SIZE) / 2 - GRID_SPACING / 2) / GRID_SPACING
  );
  const gridY = Math.round(
    (pos[1] + (GRID_SPACING * GRID_SIZE) / 2 - GRID_SPACING / 2) / GRID_SPACING
  );
  return [gridX, gridY];
};

export const gridToWorldCoordinates = (x: number, y: number): [number, number] => {
  const posX = x * GRID_SPACING - (GRID_SPACING * GRID_SIZE) / 2 + GRID_SPACING / 2;
  const posY = y * GRID_SPACING - (GRID_SPACING * GRID_SIZE) / 2 + GRID_SPACING / 2;
  return [posX, posY];
};

// Nueva función para posicionar barcos anclados en el borde de la celda
export const gridToWorldCoordinatesForShip = (x: number, y: number): [number, number] => {
  const posX = x * GRID_SPACING - (GRID_SPACING * GRID_SIZE) / 2;
  const posY = y * GRID_SPACING - (GRID_SPACING * GRID_SIZE) / 2;
  return [posX, posY];
};

export const isValidGridPosition = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
};

export const calculateGridCenterOffset = (): number => {
  return (GRID_SPACING * GRID_SIZE) / 2 - GRID_SPACING / 2;
};

export const calculateTotalGridWidth = (): number => {
  return GRID_SIZE * GRID_SPACING;
}; 