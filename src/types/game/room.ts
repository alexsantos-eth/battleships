import type { GameConfig } from "@/game/manager/initializer";
import type { GameState, PlayerRole } from "./common";

export type RoomStatus = "waiting" | "playing" | "finished";
export interface RoomPlayer {
  uid: string;
  displayName: string;
  role: PlayerRole;
  joinedAt: number;
  isReady: boolean;
}

export interface GameRoom {
  id: string;
  roomCode: string;
  status: RoomStatus;
  host: RoomPlayer;
  guest?: RoomPlayer;
  createdAt: number;
  updatedAt: number;
  gameConfig?: GameConfig;
  gameState?: GameState;
  messages?: Array<{
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: number;
  }>;
}
