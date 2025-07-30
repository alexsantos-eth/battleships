import type { Shot } from "@/types/game/common";

export interface GridCellData {
  x: number;
  y: number;
  position: [number, number, number];
  isShot: boolean;
  isHit: boolean;
  shot?: Shot;
}

export function generateGridCells(
  boardWidth: number,
  boardHeight: number,
  isPlayerShot: boolean,
  shots: Shot[],
  isCellShot: (x: number, y: number, isPlayerShot: boolean) => boolean,
  gridToWorldCoordinates: (x: number, y: number) => [number, number]
): GridCellData[] {
  const cells: GridCellData[] = [];

  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      const [posX, posY] = gridToWorldCoordinates(
        !isPlayerShot ? x : boardWidth - 1 - x,
        !isPlayerShot ? y : boardHeight - 1 - y
      );
      const position: [number, number, number] = [posX, posY, 0];

      const isShot = isCellShot(x, y, isPlayerShot);
      const shot = shots.find((s) => s.x === x && s.y === y);
      const isHit = shot?.hit || false;

      cells.push({
        x,
        y,
        position,
        isShot,
        isHit,
        shot,
      });
    }
  }

  return cells;
}

export function generatePlayerGridCells(
  boardWidth: number,
  boardHeight: number,
  playerShots: Shot[],
  isCellShot: (x: number, y: number, isPlayerShot: boolean) => boolean,
  gridToWorldCoordinates: (x: number, y: number) => [number, number]
): GridCellData[] {
  return generateGridCells(
    boardWidth,
    boardHeight,
    true,
    playerShots,
    isCellShot,
    gridToWorldCoordinates
  );
}

export function generateEnemyGridCells(
  boardWidth: number,
  boardHeight: number,
  enemyShots: Shot[],
  isCellShot: (x: number, y: number, isPlayerShot: boolean) => boolean,
  gridToWorldCoordinates: (x: number, y: number) => [number, number]
): GridCellData[] {
  return generateGridCells(
    boardWidth,
    boardHeight,
    false,
    enemyShots,
    isCellShot,
    gridToWorldCoordinates
  );
}
