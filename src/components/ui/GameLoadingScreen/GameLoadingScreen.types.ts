import type { GameConfig } from "@/game/logic/gameInitializer";

export interface GameLoadingScreenProps {
  isLoading: boolean;
  isInitialized: boolean;
  gameConfig: Partial<GameConfig> | null;
  onForceInitialization: () => void;
} 