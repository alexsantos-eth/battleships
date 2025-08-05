import { useCallback, useEffect } from "react";

import { useGameStore } from "@/bundle/stores/game/gameStore";

export const useEnemyAI = () => {
  const {
    isEnemyTurn,
    isGameOver,
    boardWidth,
    boardHeight,
    isCellShot,
    checkShot,
    addEnemyShot,
    toggleTurn,
  } = useGameStore();

  const generateRandomShot = useCallback(() => {
    const availablePositions: [number, number][] = [];

    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
        if (!isCellShot(x, y, false)) {
          availablePositions.push([x, y]);
        }
      }
    }

    if (availablePositions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
  }, [boardWidth, boardHeight, isCellShot]);

  const executeEnemyTurn = useCallback(() => {
    if (isGameOver) return;

    const shotPosition = generateRandomShot();
    if (!shotPosition) return;

    const [x, y] = shotPosition;
    const { hit, shipId } = checkShot(
      boardWidth - 1 - x,
      boardHeight - 1 - y,
      false
    );

    const shot = {
      x,
      y,
      hit,
      shipId,
    };

    addEnemyShot(shot);

    const delay = hit ? 1000 : 600;
    setTimeout(() => {
      toggleTurn();
    }, delay);
  }, [isGameOver, generateRandomShot, checkShot, addEnemyShot, toggleTurn]);

  useEffect(() => {
    if (isEnemyTurn && !isGameOver) {
      const delay = 500;
      const timeoutId = setTimeout(() => {
        executeEnemyTurn();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [isEnemyTurn, isGameOver, executeEnemyTurn]);

  return {
    executeEnemyTurn,
    generateRandomShot,
  };
};
