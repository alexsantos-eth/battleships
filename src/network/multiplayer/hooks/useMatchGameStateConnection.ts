/* eslint-disable react-hooks/exhaustive-deps */
import { useGameStore } from "@/bundle/stores/game/gameStore";
import { useMatchConnection } from "./useMatchConnection";
import { useEffect } from "react";
import { roomService } from "@/services/room/realtime";
import type { Shot } from "@/types/game/common";

export const useMatchGameStateConnection = () => {
  const { room, currentPlayer } = useMatchConnection();
  const { shotCount, playerShots, currentTurn } = useGameStore();

  const roomId = room?.id;
  const isHost = currentPlayer?.role === "host";
  const isHostAndPlayerTurn = isHost && currentTurn === "PLAYER_TURN";

  const playerShotsLength = playerShots.length;

  useEffect(() => {
    const refreshGameState = () => {
      if (roomId) {
        const shotsId = isHost ? "hostShots" : "guestShots";
        roomService.updateGameStateShots(roomId, {
          [shotsId as "hostShots" | "guestShots"]: playerShots.map((shot) => ({
            x: shot.x,
            y: shot.y,
            hit: shot.hit,
            shipId: shot.shipId || -1,
          })),
        } as Record<"hostShots" | "guestShots", Shot[]>);
      }
    };

    refreshGameState();
  }, [roomId, shotCount, playerShotsLength, isHost]);

  useEffect(() => {
    if (roomId) {
      roomService.updateCurrentTurn(
        roomId,
        isHostAndPlayerTurn ? "host" : "guest"
      );
    }
  }, [roomId, currentTurn]);
};
