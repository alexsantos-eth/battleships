import type { GameConfig } from "@/types/game/config";

export interface RoomLobbyProps {
  roomId: string;
  onGameStart?: (gameConfig: GameConfig) => void;
  onLeaveRoom?: () => void;
}
