import type { GameConfig } from "@/game/manager/initializer";

export interface RoomLobbyProps {
  roomId: string;
  onGameStart?: (gameConfig: GameConfig) => void;
  onLeaveRoom?: () => void;
}
