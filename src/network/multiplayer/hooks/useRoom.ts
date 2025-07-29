import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/auth/hooks/data/useAuth";
import { roomService } from "@/services/room/realtime";
import type { GameRoom, RoomPlayer } from "@/types/game/room";
import type { GameConfig } from "@/game/manager/initializer";

export const useRoom = (roomId?: string) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }

    const unsubscribe = roomService.subscribeToRoom(roomId, (roomData) => {
      setRoom(roomData);
      setError(null);
    });

    return unsubscribe;
  }, [roomId]);

  const createRoom = useCallback(
    async (displayName: string): Promise<GameRoom> => {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      setLoading(true);
      setError(null);

      try {
        const hostPlayer: Omit<RoomPlayer, "joinedAt" | "isReady"> = {
          uid: user.uid,
          displayName,
          role: "host",
        };

        const newRoom = await roomService.createRoom(hostPlayer);
        setRoom(newRoom);
        return newRoom;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear la sala";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const joinRoom = useCallback(
    async (roomCode: string, displayName: string): Promise<GameRoom> => {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      setLoading(true);
      setError(null);

      try {
        const guestPlayer: Omit<RoomPlayer, "joinedAt" | "isReady"> = {
          uid: user.uid,
          displayName,
          role: "guest",
        };

        const joinedRoom = await roomService.joinRoom(roomCode, guestPlayer);
        setRoom(joinedRoom);
        return joinedRoom;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al unirse a la sala";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const setPlayerReady = useCallback(
    async (isReady: boolean): Promise<void> => {
      if (!room || !user) {
        throw new Error("Sala o usuario no disponible");
      }

      setLoading(true);
      setError(null);

      try {
        await roomService.updatePlayerReady(room.id, user.uid, isReady);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar estado";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [room, user]
  );

  const startGame = useCallback(
    async (gameConfig: GameConfig): Promise<void> => {
      if (!room || !user) {
        throw new Error("Sala o usuario no disponible");
      }

      if (room.host.uid !== user.uid) {
        throw new Error("Solo el host puede iniciar el juego");
      }

      setLoading(true);
      setError(null);

      try {
        await roomService.startGame(room.id, gameConfig);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al iniciar el juego";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [room, user]
  );

  const leaveRoom = useCallback(async (): Promise<void> => {
    if (!room || !user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await roomService.leaveRoom(room.id, user.uid);
      setRoom(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al salir de la sala";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [room, user]);

  const isHost = room?.host.uid === user?.uid;
  const isGuest = room?.guest?.uid === user?.uid;
  const currentPlayer = isHost ? room?.host : isGuest ? room?.guest : null;
  const otherPlayer = isHost ? room?.guest : isGuest ? room?.host : null;

  return {
    room,
    loading,
    error,
    createRoom,
    joinRoom,
    setPlayerReady,
    startGame,
    leaveRoom,
    isHost,
    isGuest,
    currentPlayer,
    otherPlayer,
  };
};
