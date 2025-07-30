import { useGameStore } from "@/bundle/stores/game/gameStore";
import { useGridDimensions } from "@/bundle/hooks/grid/useGridDimensions";
import {
  generatePlayerGridCells,
  generateEnemyGridCells,
} from "@/bundle/tools/grid/calculations";
import { roomService } from "@/services/room/realtime";
import { useMatchConnection } from "@/network/multiplayer/hooks/useMatchConnection";

export const useCellPositions = (isPlayerGrid: boolean = true) => {
  const gameStore = useGameStore();
  const gridDimensions = useGridDimensions();

  const { room, currentPlayer } = useMatchConnection();
  const isHost = currentPlayer?.role === "host";

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

    const x = boardWidth - 1 - gridX;
    const y = boardHeight - 1 - gridY;

    if (!isValidGridPosition(x, y)) return;
    if (isCellShot(x, y, true)) return;

    const { hit, shipId } = checkShot(x, y, true);

    const shot = {
      x,
      y,
      hit,
      shipId,
    };

    addPlayerShot(shot);

    if (hit) {
      const shipDestroyed =
        shipId !== undefined && shipId !== -1 && isShipDestroyed(shipId, true);

      if (shipDestroyed) {
        setEnemyTurn();

        if (room?.id) {
          roomService.updateCurrentTurn(room?.id, isHost ? "guest" : "host");
        }
      }
    } else {
      setEnemyTurn();

      if (room?.id) {
        roomService.updateCurrentTurn(room?.id, isHost ? "guest" : "host");
      }
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
