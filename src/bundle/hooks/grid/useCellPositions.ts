import { useGameStore } from "@/bundle/stores/game/gameStore";
import { useGridDimensions } from "@/bundle/hooks/grid/useGridDimensions";
import { generatePlayerGridCells, generateEnemyGridCells } from "@/bundle/tools/grid/calculations";

export const useCellPositions = (isPlayerGrid: boolean = true) => {
  const gameStore = useGameStore();
  const gridDimensions = useGridDimensions();

  const {
    boardWidth,
    boardHeight,
    gridToWorldCoordinates,
    worldToGridCoordinates,
    isValidGridPosition,
  } = gridDimensions;

  const {
    isCellShot,
    playerShots,
    enemyShots,
    isPlayerTurn,
    checkShot,
    addPlayerShot,
    isShipDestroyed,
    setEnemyTurn,
  } = gameStore;

  const generateCells = () => {
    if (isPlayerGrid) {
      return generatePlayerGridCells(
        boardWidth,
        boardHeight,
        playerShots,
        isCellShot,
        gridToWorldCoordinates
      );
    } else {
      return generateEnemyGridCells(
        boardWidth,
        boardHeight,
        enemyShots,
        isCellShot,
        gridToWorldCoordinates
      );
    }
  };

  const handleCellClick = (pos: [number, number, number]) => {
    if (!isPlayerTurn) return;

    const [gridX, gridY] = worldToGridCoordinates(pos);

    if (!isValidGridPosition(gridX, gridY)) return;
    if (isCellShot(gridX, gridY, true)) return;

    const { hit, shipId } = checkShot(gridX, gridY, true);

    const shot = {
      x: gridX,
      y: gridY,
      hit,
      shipId,
    };

    addPlayerShot(shot);

    if (hit) {
      const shipDestroyed =
        shipId !== undefined && isShipDestroyed(shipId, true);
      if (shipDestroyed) {
        setEnemyTurn();
      }
    } else {
      setEnemyTurn();
    }
  };

  return {
    cells: generateCells(),
    handleCellClick,
    boardWidth,
    boardHeight,
    isPlayerTurn,
  };
}; 