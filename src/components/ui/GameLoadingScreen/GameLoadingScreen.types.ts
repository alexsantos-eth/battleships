import type { GameConfig } from "@/types/game/config";

export interface GameLoadingScreenProps {
  isLoading: boolean;
  isInitialized: boolean;
  gameConfig: Partial<GameConfig> | null;
  onForceInitialization: () => void;
}
