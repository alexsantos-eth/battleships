import { useEffect } from "react";

import { useGameStore } from "@/bundle/stores/game/gameStore";

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
  const enemyShotsLength = enemyShots?.length ?? 0;
  const playerShotsLength = playerShots?.length ?? 0;

  useEffect(() => {
    if (roomTurn === "host" && isHost) {
      setPlayerTurn();
    } else if (roomTurn === "guest" && !isHost) {
      setPlayerTurn();
    }
  }, [roomTurn]);

  useEffect(() => {
    if (roomTurn === "host" && !isHost) {
      setEnemyTurn();
    } else if (roomTurn === "guest" && isHost) {
      setEnemyTurn();
    }
  }, [roomTurn]);

  useEffect(() => {
    if (enemyShotsLength) {
      const newShots = enemyShots.map((shot) => {
        const newShot = checkShot(
          boardWidth - 1 - shot.x,
          boardHeight - 1 - shot.y,
          false
        );

        return {
          x: shot.x,
          y: shot.y,
          hit: newShot.hit,
          shipId: newShot.shipId,
        };
      });

      setEnemyShots(newShots);
    }

    if (playerShotsLength) {
      const newShots = playerShots.map((shot) => {
        const newShot = checkShot(shot.x, shot.y, true);

        return {
          x: shot.x,
          y: shot.y,
          hit: newShot.hit,
          shipId: newShot.shipId,
        };
      });

      setPlayerShots(newShots);
    }
  }, [enemyShotsLength, playerShotsLength]);
};
