import { useGameStore } from "@/stores/gameStore";

export interface GridPosition {
  x: number;
  y: number;
}

export class CoordinateUtils {
  static logicalToEnemyVisual(pos: GridPosition): GridPosition {
    const { boardWidth, boardHeight } = useGameStore.getState();
    const gridSize = Math.max(boardWidth, boardHeight);
    
    return {
      x: gridSize - 1 - pos.x,
      y: gridSize - 1 - pos.y,
    };
  }

  static enemyVisualToLogical(pos: GridPosition): GridPosition {
    const { boardWidth, boardHeight } = useGameStore.getState();
    const gridSize = Math.max(boardWidth, boardHeight);
    
    return {
      x: gridSize - 1 - pos.x,
      y: gridSize - 1 - pos.y,
    };
  }

  static isValidPosition(pos: GridPosition): boolean {
    const { boardWidth, boardHeight } = useGameStore.getState();
    
    return (
      pos.x >= 0 && pos.x < boardWidth &&
      pos.y >= 0 && pos.y < boardHeight
    );
  }

  static getShipCells(
    coords: [number, number],
    orientation: "horizontal" | "vertical",
    size: number
  ): GridPosition[] {
    const cells: GridPosition[] = [];
    for (let i = 0; i < size; i++) {
      cells.push(
        orientation === "horizontal"
          ? { x: coords[0] + i, y: coords[1] }
          : { x: coords[0], y: coords[1] + i }
      );
    }
    return cells;
  }
} 