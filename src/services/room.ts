import type { GameRoom, RoomPlayer, GameConfig, GameState } from "@/types/game";
import { dbUtils } from "@/utils/realtimeDatabase";

export class RoomService {
  private static instance: RoomService;

  static getInstance(): RoomService {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }
    return RoomService.instance;
  }

  private generateRoomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async isRoomCodeUnique(roomCode: string): Promise<boolean> {
    const rooms = await dbUtils.queryDocuments<GameRoom>("rooms", [
      { type: "orderByChild", field: "roomCode", value: roomCode },
    ]);
    return rooms.length === 0;
  }

  async createRoom(
    hostPlayer: Omit<RoomPlayer, "joinedAt" | "isReady">
  ): Promise<GameRoom> {
    let roomCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      roomCode = this.generateRoomCode();
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error("No se pudo generar un código único para la sala");
      }
    } while (!(await this.isRoomCodeUnique(roomCode)));

    const roomId = dbUtils.generateUniqueId();
    const now = Date.now();

    const room: GameRoom = {
      id: roomId,
      roomCode,
      status: "waiting",
      host: {
        ...hostPlayer,
        joinedAt: now,
        isReady: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    await dbUtils.createDocument(
      "rooms",
      room as unknown as Record<string, unknown>,
      roomId
    );

    return room;
  }

  async joinRoom(
    roomCode: string,
    guestPlayer: Omit<RoomPlayer, "joinedAt" | "isReady">
  ): Promise<GameRoom> {
    const rooms = await dbUtils.queryDocuments<GameRoom>("rooms", [
      { type: "orderByChild", field: "roomCode", value: roomCode },
    ]);

    if (rooms.length === 0) {
      throw new Error("Sala no encontrada");
    }

    const roomData = rooms[0];

    if (roomData.status !== "waiting") {
      throw new Error("La sala ya no está disponible para unirse");
    }

    if (roomData.guest) {
      throw new Error("La sala ya está llena");
    }

    const now = Date.now();
    const updatedRoom: GameRoom = {
      ...roomData,
      guest: {
        ...guestPlayer,
        joinedAt: now,
        isReady: false,
      },
      updatedAt: now,
    };

    await dbUtils.updateDocument(`rooms/${roomData.id}`, {
      guest: updatedRoom.guest,
    });

    return updatedRoom;
  }

  async getRoom(roomId: string): Promise<GameRoom | null> {
    return await dbUtils.getDocument<GameRoom>(`rooms/${roomId}`);
  }

  async getRoomByCode(roomCode: string): Promise<GameRoom | null> {
    const rooms = await dbUtils.queryDocuments<GameRoom>("rooms", [
      { type: "orderByChild", field: "roomCode", value: roomCode },
    ]);
    return rooms.length > 0 ? rooms[0] : null;
  }

  async updatePlayerReady(
    roomId: string,
    playerUid: string,
    isReady: boolean
  ): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new Error("Sala no encontrada");
    }

    if (room.host.uid === playerUid) {
      const updatedHost = { ...room.host, isReady };
      await dbUtils.updateDocument(`rooms/${roomId}`, {
        host: updatedHost,
      });
    } else if (room.guest?.uid === playerUid) {
      const updatedGuest = { ...room.guest, isReady };
      await dbUtils.updateDocument(`rooms/${roomId}`, {
        guest: updatedGuest,
      });
    } else {
      throw new Error("Jugador no encontrado en la sala");
    }
  }

  async startGame(roomId: string, gameConfig: GameConfig): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new Error("Sala no encontrada");
    }

    if (!room.host.isReady || !room.guest?.isReady) {
      throw new Error("Ambos jugadores deben estar listos para comenzar");
    }

    await dbUtils.updateDocument(`rooms/${roomId}`, {
      status: "playing",
      gameConfig,
    });
  }

  async updateGameState(roomId: string, gameState: GameState): Promise<void> {
    await dbUtils.updateDocument(`rooms/${roomId}`, {
      gameState,
    });
  }

  async endGame(roomId: string): Promise<void> {
    await dbUtils.updateDocument(`rooms/${roomId}`, {
      status: "finished",
    });
  }

  async deleteRoom(roomId: string): Promise<void> {
    await dbUtils.deleteDocument(`rooms/${roomId}`);
  }

  subscribeToRoom(
    roomId: string,
    callback: (room: GameRoom | null) => void
  ): () => void {
    return dbUtils.subscribeToDocument(`rooms/${roomId}`, callback);
  }

  async leaveRoom(roomId: string, playerUid: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) {
      return;
    }

    if (room.host.uid === playerUid) {
      if (room.guest) {
        await dbUtils.updateDocument(`rooms/${roomId}`, {
          host: room.guest,
          guest: null,
        });
      } else {
        await this.deleteRoom(roomId);
      }
    } else if (room.guest?.uid === playerUid) {
      await dbUtils.updateDocument(`rooms/${roomId}`, {
        guest: null,
      });
    }
  }
}

export const roomService = RoomService.getInstance();
