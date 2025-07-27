import { useGameStore } from '@/stores/gameStore';
import { GAME_CONSTANTS } from '@/utils/constants';

export const useGameState = () => {
  const { playerShips, enemyShips, isEnemyTurn, initializeGame, currentTurn } = useGameStore();

  const getShipAtPosition = (x: number, y: number, isPlayerBoard: boolean = true) => {
    const ships = isPlayerBoard ? playerShips : enemyShips;
    
    for (const ship of ships) {
      const shipCells = getShipCells(ship.coords[0], ship.coords[1], getShipSize(ship.variant), ship.orientation);
      for (const [shipX, shipY] of shipCells) {
        if (shipX === x && shipY === y) {
          return ship;
        }
      }
    }
    return null;
  };

  const getShipSize = (variant: "small" | "medium" | "large" | "xlarge") => {
    const sizeMap = {
      small: GAME_CONSTANTS.SHIPS.SIZES.small,
      medium: GAME_CONSTANTS.SHIPS.SIZES.medium,
      large: GAME_CONSTANTS.SHIPS.SIZES.large,
      xlarge: GAME_CONSTANTS.SHIPS.SIZES.xlarge,
    };
    return sizeMap[variant];
  };

  const getShipCells = (x: number, y: number, size: number, orientation: "horizontal" | "vertical") => {
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
  };

  const getPlayerShips = () => playerShips;
  const getEnemyShips = () => enemyShips;
  const getIsEnemyTurn = () => isEnemyTurn;

  return {
    currentTurn,
    playerShips,
    enemyShips,
    isEnemyTurn,
    initializeGame,
    getShipAtPosition,
    getShipSize,
    getShipCells,
    getPlayerShips,
    getEnemyShips,
    getIsEnemyTurn,
  };
}; 