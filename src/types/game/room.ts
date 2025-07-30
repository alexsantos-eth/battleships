import type { GameState, PlayerRole, Shot } from "./common";
import type { GameConfig } from "./config";

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
  initialTurn: PlayerRole;
  createdAt: number;
  updatedAt: number;
  gameConfig?: Omit<GameConfig, "initialTurn">;

  hostShots?: Shot[];
  guestShots?: Shot[];
  shotCount?: number;

  initialState?: Partial<GameState>;
  currentTurn?: PlayerRole;
  messages?: Array<{
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: number;
  }>;
}
