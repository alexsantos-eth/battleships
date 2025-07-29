import React, { useCallback, useMemo } from "react";

import { GAME_CONSTANTS } from "@/constants/game/board";

import type { GameBoardProps, CellData } from "./GameBoard.types";
export const GameBoard: React.FC<GameBoardProps> = ({
  ships,
  shots,
  onCellClick,
  isPlayerBoard = false,
  disabled = false,
  className = "",
}) => {
  const boardCells = useMemo(() => {
    const cells: CellData[][] = [];

    for (let y = 0; y < GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT; y++) {
      cells[y] = [];
      for (let x = 0; x < GAME_CONSTANTS.BOARD.DEFAULT_WIDTH; x++) {
        const shipAtPosition = ships.find((ship) => {
          const shipCells = getShipCells(ship);
          return shipCells.some(([shipX, shipY]) => shipX === x && shipY === y);
        });

        const shotAtPosition = shots.find(
          (shot) => shot.x === x && shot.y === y
        );

        cells[y][x] = {
          x,
          y,
          hasShip: !!shipAtPosition,
          hasShot: !!shotAtPosition,
          isHit: shotAtPosition?.hit || false,
          shipId: shipAtPosition?.id,
        };
      }
    }

    return cells;
  }, [ships, shots]);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (!disabled && onCellClick) {
        onCellClick(x, y);
      }
    },
    [disabled, onCellClick]
  );

  const getCellClassName = (cell: CellData) => {
    const baseClasses =
      "w-8 h-8 border border-gray-300 cursor-pointer transition-colors";

    if (cell.hasShot) {
      if (cell.isHit) {
        return `${baseClasses} bg-red-500`;
      } else {
        return `${baseClasses} bg-blue-500`;
      }
    }

    if (cell.hasShip && isPlayerBoard) {
      return `${baseClasses} bg-gray-600`;
    }

    return `${baseClasses} bg-white hover:bg-gray-100`;
  };

  return (
    <div className={`grid grid-cols-10 gap-0 ${className}`}>
      {boardCells.map((row, y) =>
        row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            className={getCellClassName(cell)}
            onClick={() => handleCellClick(x, y)}
            disabled={disabled}
            data-testid={`cell-${x}-${y}`}
          />
        ))
      )}
    </div>
  );
};

function getShipCells(ship: {
  variant: string;
  coords: [number, number];
  orientation: string;
}): [number, number][] {
  const cells: [number, number][] = [];
  const size =
    GAME_CONSTANTS.SHIPS.SIZES[
      ship.variant as keyof typeof GAME_CONSTANTS.SHIPS.SIZES
    ];
  const [startX, startY] = ship.coords;

  if (ship.orientation === "horizontal") {
    for (let i = 0; i < size; i++) {
      cells.push([startX + i, startY]);
    }
  } else {
    for (let i = 0; i < size; i++) {
      cells.push([startX, startY + i]);
    }
  }

  return cells;
}
