/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/auth/hooks/data/useAuth";
import { roomService } from "@/services/room/realtime";

import type { GameRoom, RoomPlayer } from "@/types/game/room";

export interface MatchMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

export interface MatchConnectionState {
  room: GameRoom | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  messages: MatchMessage[];
  currentPlayer: RoomPlayer | null;
  otherPlayer: RoomPlayer | null;
}

export const useMatchConnection = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [state, setState] = useState<MatchConnectionState>({
    room: null,
    isConnected: false,
    isLoading: true,
    error: null,
    messages: [],
    currentPlayer: null,
    otherPlayer: null,
  });

  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!state.room || !user) {
        return;
      }

      const newMessage: MatchMessage = {
        id: Date.now().toString(),
        senderId: user.uid,
        senderName: user.displayName || "Unknown",
        message,
        timestamp: Date.now(),
      };

      try {
        await roomService.sendMessage(state.room.id, newMessage);
      } catch (error) {
        console.warn("Error sending message:", error);
      }
    },
    [state.room, user]
  );

  const leaveRoom = useCallback(async () => {
    if (!state.room || !user) return;

    try {
      await roomService.leaveRoom(state.room.id, user.uid);
      navigate("/multiplayer");
    } catch (error) {
      console.warn("Error leaving room:", error);
    }
  }, [state.room, user, navigate]);

  const setPlayerReady = useCallback(
    async (isReady: boolean) => {
      if (!state.room || !user) return;

      try {
        await roomService.updatePlayerReady(state.room.id, user.uid, isReady);
      } catch (error) {
        console.warn("Error updating player ready status:", error);
      }
    },
    [state.room, user]
  );

  useEffect(() => {
    if (!roomId || !user) {
      setState((prev) => ({
        ...prev,
        error: "Room ID or user not found",
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const subscribeToRoom = async () => {
      try {
        const room = await roomService.getRoom(roomId);

        if (!room) {
          setState((prev) => ({
            ...prev,
            error: "Sala no encontrada",
            isLoading: false,
          }));
          return;
        }

        if (
          !room.host ||
          (room.guest &&
            room.guest.uid !== user.uid &&
            room.host.uid !== user.uid)
        ) {
          setState((prev) => ({
            ...prev,
            error: "No tienes acceso a esta sala",
            isLoading: false,
          }));
          return;
        }

        const currentPlayer =
          room.host.uid === user.uid ? room.host : room.guest || null;
        const otherPlayer =
          room.host.uid === user.uid ? room.guest || null : room.host;

        setState((prev) => ({
          ...prev,
          room,
          currentPlayer,
          otherPlayer,
          isLoading: false,
          isConnected: true,
        }));

        const unsubscribeRoom = roomService.subscribeToRoom(
          roomId,
          (updatedRoom) => {
            if (updatedRoom) {
              const updatedCurrentPlayer =
                updatedRoom.host.uid === user.uid
                  ? updatedRoom.host
                  : updatedRoom.guest || null;
              const updatedOtherPlayer =
                updatedRoom.host.uid === user.uid
                  ? updatedRoom.guest || null
                  : updatedRoom.host;

              setState((prev) => ({
                ...prev,
                room: updatedRoom,
                currentPlayer: updatedCurrentPlayer,
                otherPlayer: updatedOtherPlayer,
                isConnected: true,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                error: "La sala ha sido eliminada",
                isConnected: false,
              }));
            }
          }
        );

        const unsubscribeMessages = roomService.subscribeToMessages(
          roomId,
          (messages) => {
            setState((prev) => ({
              ...prev,
              messages,
            }));
          }
        );

        setUnsubscribe(() => {
          return () => {
            unsubscribeRoom();
            unsubscribeMessages();
          };
        });

        setState((prev) => ({
          ...prev,
          isConnected: true,
        }));
      } catch (error) {
        console.warn("Error connecting to room:", error);
        setState((prev) => ({
          ...prev,
          error: "Error al conectar con la sala",
          isLoading: false,
        }));
      }
    };

    subscribeToRoom();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  return {
    ...state,
    sendMessage,
    leaveRoom,
    setPlayerReady,
  };
};
