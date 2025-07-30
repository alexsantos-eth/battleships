import { useEffect } from "react";

import { useGameStore } from "@/bundle/stores/game/gameStore";
import type { Shot } from "@/types/game/common";

import { useMatchConnection } from "./useMatchConnection";

export const useMatchTurnHandler = () => {
  const { room, currentPlayer } = useMatchConnection();
  const {
    checkShot,
    boardWidth,
    boardHeight,
    setEnemyShots,
    setPlayerTurn,
    setEnemyTurn,
    setPlayerShots,
  } = useGameStore();

  const isHost = currentPlayer?.role === "host";
  const roomTurn = room?.currentTurn;

  const enemyShots = (isHost ? room?.guestShots : room?.hostShots) ?? [];
  const playerShots = (isHost ? room?.hostShots : room?.guestShots) ?? [];

  const processShots = (shots: Shot[], isPlayerBoard: boolean) => {
    return shots.map((shot) => {
      const coordinates = isPlayerBoard
        ? { x: shot.x, y: shot.y }
        : { x: boardWidth - 1 - shot.x, y: boardHeight - 1 - shot.y };

      const result = checkShot(coordinates.x, coordinates.y, isPlayerBoard);

      return {
        x: shot.x,
        y: shot.y,
        hit: result.hit,
        shipId: result.shipId,
      };
    });
  };

  const isPlayerTurn = (turn: string) => {
    return (turn === "host" && isHost) || (turn === "guest" && !isHost);
  };

  const isEnemyTurn = (turn: string) => {
    return (turn === "host" && !isHost) || (turn === "guest" && isHost);
  };

  useEffect(() => {
    if (roomTurn && isPlayerTurn(roomTurn)) {
      setPlayerTurn();
    }
  }, [roomTurn, isHost]);

  useEffect(() => {
    if (roomTurn && isEnemyTurn(roomTurn)) {
      setEnemyTurn();
    }
  }, [roomTurn, isHost]);

  useEffect(() => {
    if (enemyShots.length > 0) {
      const processedShots = processShots(enemyShots, false);
      setEnemyShots(processedShots);
    }
  }, [enemyShots.length]);

  useEffect(() => {
    if (playerShots.length > 0) {
      const processedShots = processShots(playerShots, true);
      setPlayerShots(processedShots);
    }
  }, [playerShots.length]);
};
