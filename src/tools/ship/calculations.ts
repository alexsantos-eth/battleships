import { GAME_CONSTANTS } from "@/constants/game/board";
import type { ShipVariant, GameShip } from "@/types/game/common";
import type { GameConfig } from "@/types/game/config";

export function getShipCells(
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

export function getShipCellsFromShip(ship: GameShip): [number, number][] {
  const size = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];
  const [x, y] = ship.coords;

  return getShipCells(x, y, size, ship.orientation);
}

export function getShipSize(variant: ShipVariant): number {
  return GAME_CONSTANTS.SHIPS.SIZES[variant];
}

export function isValidShipPlacement(
  ship: GameShip,
  existingShips: GameShip[],
  boardWidth: number,
  boardHeight: number
): boolean {
  const shipCells = getShipCellsFromShip(ship);

  for (const [x, y] of shipCells) {
    if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) {
      return false;
    }
  }

  for (const existingShip of existingShips) {
    const existingCells = getShipCellsFromShip(existingShip);

    for (const [shipX, shipY] of shipCells) {
      for (const [existingX, existingY] of existingCells) {
        const distance = Math.max(
          Math.abs(shipX - existingX),
          Math.abs(shipY - existingY)
        );
        if (distance < GAME_CONSTANTS.SHIPS.MIN_DISTANCE) {
          return false;
        }
      }
    }
  }

  return true;
}

export function generateShip(
  variant: ShipVariant,
  boardWidth: number,
  boardHeight: number,
  existingShips: GameShip[]
): GameShip | null {
  const maxAttempts = GAME_CONSTANTS.SHIPS.MAX_PLACEMENT_ATTEMPTS;
  const shipSize = getShipSize(variant);

  const quadrantPreferences = getQuadrantPreferences(variant);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const orientation =
      Math.random() <
      GAME_CONSTANTS.GAME_LOGIC.SHIP_GENERATION.ORIENTATION_RANDOM_THRESHOLD
        ? "horizontal"
        : "vertical";
    let coords: [number, number];

    if (Math.random() < 0.7 && existingShips.length > 0) {
      coords = generatePositionInPreferredQuadrant(
        shipSize,
        orientation,
        quadrantPreferences,
        boardWidth,
        boardHeight
      );
    } else {
      coords = generateRandomPosition(
        shipSize,
        orientation,
        boardWidth,
        boardHeight
      );
    }

    const ship: GameShip = {
      coords,
      variant,
      orientation,
      shipId: existingShips.length,
    };

    if (isValidShipPlacement(ship, existingShips, boardWidth, boardHeight)) {
      return ship;
    }
  }

  return null;
}

export function getQuadrantPreferences(variant: ShipVariant): number[][] {
  const preferences = {
    small: [
      [0, 1],
      [2, 3],
    ],
    medium: [
      [1, 2],
      [0, 3],
    ],
    large: [
      [0, 2],
      [1, 3],
    ],
    xlarge: [[0, 1, 2, 3]],
  };
  return preferences[variant];
}

export function generatePositionInPreferredQuadrant(
  shipSize: number,
  orientation: "horizontal" | "vertical",
  quadrantPreferences: number[][],
  boardWidth: number,
  boardHeight: number
): [number, number] {
  const targetQuadrant =
    quadrantPreferences[Math.floor(Math.random() * quadrantPreferences.length)];
  const quadrant =
    targetQuadrant[Math.floor(Math.random() * targetQuadrant.length)];

  const quadrantSize =
    Math.max(boardWidth, boardHeight) /
    GAME_CONSTANTS.GAME_LOGIC.SHIP_GENERATION.QUADRANT_SIZE_DIVISOR;
  const xMin = (quadrant % 2) * quadrantSize;
  const yMin = Math.floor(quadrant / 2) * quadrantSize;
  const xMax = xMin + quadrantSize - 1;
  const yMax = yMin + quadrantSize - 1;

  let x: number, y: number;

  if (orientation === "horizontal") {
    x =
      Math.floor(
        Math.random() * (Math.min(xMax, boardWidth - shipSize) - xMin + 1)
      ) + xMin;
    y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
  } else {
    x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    y =
      Math.floor(
        Math.random() * (Math.min(yMax, boardHeight - shipSize) - yMin + 1)
      ) + yMin;
  }

  return [x, y];
}

export function generateRandomPosition(
  shipSize: number,
  orientation: "horizontal" | "vertical",
  boardWidth: number,
  boardHeight: number
): [number, number] {
  let x: number, y: number;

  if (orientation === "horizontal") {
    x = Math.floor(Math.random() * (boardWidth - shipSize + 1));
    y = Math.floor(Math.random() * boardHeight);
  } else {
    x = Math.floor(Math.random() * boardWidth);
    y = Math.floor(Math.random() * (boardHeight - shipSize + 1));
  }

  return [x, y];
}

export function generateShips(config: Partial<GameConfig>): GameShip[] {
  const ships: GameShip[] = [];
  const shipVariants: ShipVariant[] = ["small", "medium", "large", "xlarge"];

  for (const variant of shipVariants) {
    const count = config.shipCounts?.[variant] ?? 0;
    for (let i = 0; i < count; i++) {
      const ship = generateShip(
        variant,
        config.boardWidth ?? GAME_CONSTANTS.BOARD.DEFAULT_WIDTH,
        config.boardHeight ?? GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT,
        ships
      );
      if (ship) {
        ships.push(ship);
      } else {
        console.warn(
          `Failed to place ${variant} ship ${
            i + 1
          }/${count}. Board may be too crowded.`
        );
      }
    }
  }

  return ships;
}
