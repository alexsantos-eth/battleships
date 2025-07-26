export type GridPosition = { x: number; y: number };

export class CoordinateUtils {
  static readonly GRID_SIZE = 10;

  static logicalToEnemyVisual(pos: GridPosition): GridPosition {
    return {
      x: this.GRID_SIZE - 1 - pos.x,
      y: this.GRID_SIZE - 1 - pos.y,
    };
  }

  static enemyVisualToLogical(pos: GridPosition): GridPosition {
    return {
      x: this.GRID_SIZE - 1 - pos.x,
      y: this.GRID_SIZE - 1 - pos.y,
    };
  }

  static isValidPosition(pos: GridPosition): boolean {
    return (
      pos.x >= 0 && pos.x < this.GRID_SIZE &&
      pos.y >= 0 && pos.y < this.GRID_SIZE
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