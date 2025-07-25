import { useGameStore } from '@/stores/gameStore';

import type { Ship, ShipVariant } from "@/stores/gameStore";

export const useGameState = () => {
  const {
    currentTurn,
    isPlayerTurn,
    isEnemyTurn,
    playerShips,
    enemyShips,
    setPlayerTurn,
    setEnemyTurn,
    toggleTurn,
    setPlayerShips,
    setEnemyShips,
    initializeGame,
  } = useGameStore();

  const getShipAtPosition = (x: number, y: number, isPlayerBoard: boolean): Ship | null => {
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

  const getShipSize = (variant: ShipVariant): number => {
    const sizeMap = {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    };
    return sizeMap[variant];
  };

  const getShipCells = (
    x: number,
    y: number,
    size: number,
    orientation: "horizontal" | "vertical"
  ): [number, number][] => {
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

  return {
    currentTurn,
    isPlayerTurn,
    isEnemyTurn,
    playerShips,
    enemyShips,
    setPlayerTurn,
    setEnemyTurn,
    toggleTurn,
    setPlayerShips,
    setEnemyShips,
    initializeGame,
    getShipAtPosition,
    getShipSize,
    getShipCells,
  };
}; 