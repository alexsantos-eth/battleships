import { useCallback, useMemo } from "react";
import { useGameStore } from "@/stores/game";
import { GAME_CONSTANTS } from "@/constants/game";

export const useGameState = () => {
  const {
    currentTurn,
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    isGameOver,
    winner,
    boardWidth,
    boardHeight,
    setPlayerTurn,
    setEnemyTurn,
    addPlayerShot,
    addEnemyShot,
    initializeGame,
    resetGame,
  } = useGameStore();

  const isPlayerTurn = useMemo(
    () => currentTurn === "PLAYER_TURN",
    [currentTurn]
  );
  const isEnemyTurn = useMemo(
    () => currentTurn === "ENEMY_TURN",
    [currentTurn]
  );

  const totalShots = useMemo(
    () => playerShots.length + enemyShots.length,
    [playerShots.length, enemyShots.length]
  );

  const playerHits = useMemo(
    () => playerShots.filter((shot) => shot.hit).length,
    [playerShots]
  );

  const enemyHits = useMemo(
    () => enemyShots.filter((shot) => shot.hit).length,
    [enemyShots]
  );

  const getShipAtPosition = useCallback(
    (x: number, y: number, isPlayerBoard: boolean = true) => {
      const ships = isPlayerBoard ? playerShips : enemyShips;

      for (const ship of ships) {
        const shipCells = getShipCells(
          ship.coords[0],
          ship.coords[1],
          getShipSize(ship.variant),
          ship.orientation
        );
        for (const [shipX, shipY] of shipCells) {
          if (shipX === x && shipY === y) {
            return ship;
          }
        }
      }
      return null;
    },
    [playerShips, enemyShips]
  );

  const getShipSize = useCallback(
    (variant: "small" | "medium" | "large" | "xlarge") => {
      return GAME_CONSTANTS.SHIPS.SIZES[variant];
    },
    []
  );

  const getShipCells = useCallback(
    (
      x: number,
      y: number,
      size: number,
      orientation: "horizontal" | "vertical"
    ) => {
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
    },
    []
  );

  const getPlayerShips = useCallback(() => playerShips, [playerShips]);
  const getEnemyShips = useCallback(() => enemyShips, [enemyShips]);
  const getIsEnemyTurn = useCallback(() => isEnemyTurn, [isEnemyTurn]);

  const gameStats = useMemo(
    () => ({
      totalShots,
      playerHits,
      enemyHits,
      playerAccuracy:
        totalShots > 0 ? (playerHits / playerShots.length) * 100 : 0,
      enemyAccuracy: totalShots > 0 ? (enemyHits / enemyShots.length) * 100 : 0,
    }),
    [totalShots, playerHits, enemyHits, playerShots.length, enemyShots.length]
  );

  return {
    currentTurn,
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    isGameOver,
    winner,
    boardWidth,
    boardHeight,
    isPlayerTurn,
    isEnemyTurn,

    gameStats,

    setPlayerTurn,
    setEnemyTurn,
    addPlayerShot,
    addEnemyShot,
    initializeGame,
    resetGame,

    getShipAtPosition,
    getShipSize,
    getShipCells,
    getPlayerShips,
    getEnemyShips,
    getIsEnemyTurn,
  };
};
