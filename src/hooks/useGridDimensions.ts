import { useGameStore } from '@/stores/gameStore';

export const GRID_SPACING = 0.5;

export const useGridDimensions = () => {
  const { boardWidth, boardHeight } = useGameStore();

  const worldToGridCoordinates = (pos: [number, number, number]): [number, number] => {
    const gridX = Math.round(
      (pos[0] + (GRID_SPACING * boardWidth) / 2 - GRID_SPACING / 2) / GRID_SPACING
    );
    const gridY = Math.round(
      (pos[1] + (GRID_SPACING * boardHeight) / 2 - GRID_SPACING / 2) / GRID_SPACING
    );
    return [gridX, gridY];
  };

  const gridToWorldCoordinates = (x: number, y: number): [number, number] => {
    const posX = x * GRID_SPACING - (GRID_SPACING * boardWidth) / 2 + GRID_SPACING / 2;
    const posY = y * GRID_SPACING - (GRID_SPACING * boardHeight) / 2 + GRID_SPACING / 2;
    return [posX, posY];
  };

  const gridToWorldCoordinatesForShip = (x: number, y: number): [number, number] => {
    const posX = x * GRID_SPACING - (GRID_SPACING * boardWidth) / 2;
    const posY = y * GRID_SPACING - (GRID_SPACING * boardHeight) / 2;
    return [posX, posY];
  };

  const isValidGridPosition = (x: number, y: number): boolean => {
    return x >= 0 && x < boardWidth && y >= 0 && y < boardHeight;
  };

  const calculateGridCenterOffset = (): number => {
    return (GRID_SPACING * Math.max(boardWidth, boardHeight)) / 2 - GRID_SPACING / 2;
  };

  const calculateTotalGridWidth = (): number => {
    return boardWidth * GRID_SPACING;
  };

  const calculateTotalGridHeight = (): number => {
    return boardHeight * GRID_SPACING;
  };

  const getGridSize = (): number => {
    return Math.max(boardWidth, boardHeight);
  };

  return {
    boardWidth,
    boardHeight,
    GRID_SPACING,
    worldToGridCoordinates,
    gridToWorldCoordinates,
    gridToWorldCoordinatesForShip,
    isValidGridPosition,
    calculateGridCenterOffset,
    calculateTotalGridWidth,
    calculateTotalGridHeight,
    getGridSize,
  };
}; 