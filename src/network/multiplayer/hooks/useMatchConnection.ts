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
        console.log("❌ No se puede enviar mensaje - room o user faltante");
        return;
      }

      const newMessage: MatchMessage = {
        id: Date.now().toString(),
        senderId: user.uid,
        senderName: user.displayName || "Unknown",
        message,
        timestamp: Date.now(),
      };

      console.log("💬 Hook: Intentando enviar mensaje:", newMessage);

      try {
        await roomService.sendMessage(state.room.id, newMessage);
        console.log("✅ Hook: Mensaje enviado exitosamente");
      } catch (error) {
        console.error("❌ Hook: Error sending message:", error);
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
      console.error("Error leaving room:", error);
    }
  }, [state.room, user, navigate]);

  const setPlayerReady = useCallback(
    async (isReady: boolean) => {
      if (!state.room || !user) return;

      try {
        await roomService.updatePlayerReady(state.room.id, user.uid, isReady);
      } catch (error) {
        console.error("Error updating player ready status:", error);
      }
    },
    [state.room, user]
  );

  useEffect(() => {
    if (!roomId || !user) {
      console.log("❌ Hook: RoomId o user faltante", { roomId, user: !!user });
      setState((prev) => ({
        ...prev,
        error: "Room ID or user not found",
        isLoading: false,
      }));
      return;
    }

    console.log("🔄 Hook: Iniciando conexión a sala:", roomId);
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const subscribeToRoom = async () => {
      try {
        console.log("📡 Hook: Obteniendo sala inicial...");
        const room = await roomService.getRoom(roomId);

        if (!room) {
          console.log("❌ Hook: Sala no encontrada");
          setState((prev) => ({
            ...prev,
            error: "Sala no encontrada",
            isLoading: false,
          }));
          return;
        }

        console.log("✅ Hook: Sala encontrada:", room.roomCode);

        if (
          !room.host ||
          (room.guest &&
            room.guest.uid !== user.uid &&
            room.host.uid !== user.uid)
        ) {
          console.log("❌ Hook: Usuario no tiene acceso a la sala");
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

        console.log("👤 Hook: Jugador actual:", currentPlayer?.displayName);

        setState((prev) => ({
          ...prev,
          room,
          currentPlayer,
          otherPlayer,
          isLoading: false,
          isConnected: true,
        }));

        console.log("📡 Hook: Configurando suscripciones...");

        const unsubscribeRoom = roomService.subscribeToRoom(
          roomId,
          (updatedRoom) => {
            if (updatedRoom) {
              console.log(
                "🔄 Hook: Actualización de sala recibida:",
                updatedRoom.roomCode
              );
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
              console.log("❌ Hook: Sala eliminada");
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
            console.log(
              "📨 Hook: Mensajes recibidos:",
              messages.length,
              messages
            );
            setState((prev) => ({
              ...prev,
              messages,
            }));
          }
        );

        setUnsubscribe(() => {
          console.log("🔌 Hook: Configurando cleanup de suscripciones");
          return () => {
            console.log("🔌 Hook: Limpiando suscripciones");
            unsubscribeRoom();
            unsubscribeMessages();
          };
        });

        console.log("✅ Hook: Conexión establecida para la sala:", roomId);
        setState((prev) => ({
          ...prev,
          isConnected: true,
        }));
      } catch (error) {
        console.error("❌ Hook: Error connecting to room:", error);
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
        console.log("🔌 Hook: Cleanup del efecto principal");
        unsubscribe();
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    return () => {
      if (unsubscribe) {
        console.log("🔌 Hook: Cleanup del efecto de cleanup");
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
