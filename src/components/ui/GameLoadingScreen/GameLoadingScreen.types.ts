import type { GameConfig } from "@/game/manager/initializer";

export interface GameLoadingScreenProps {
  isLoading: boolean;
  isInitialized: boolean;
  gameConfig: Partial<GameConfig> | null;
  onForceInitialization: () => void;
} 