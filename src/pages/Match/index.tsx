import { useEnemyAI } from "@/hooks/useEnemyAI";
import { useGameInitialization } from "@/hooks/useGameInitialization";
import { useGameStore } from "@/stores/game";
import { GameLoadingScreen } from "@/components/ui";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { GameScreen } from "@/components/features/GameScreen";

const Match = () => {
  const { initializeGame } = useGameStore();
  const gameConfig = useGameInitialization();
  useEnemyAI();

  if (!gameConfig.gameConfig) {
    return <LoadingScreen message="Cargando configuración..." />;
  }

  if (gameConfig.isLoading || !gameConfig.isInitialized) {
    return (
      <GameLoadingScreen
        isLoading={gameConfig.isLoading}
        isInitialized={gameConfig.isInitialized}
        gameConfig={gameConfig.gameConfig}
        onForceInitialization={() =>
          gameConfig.forceInitialization(initializeGame)
        }
      />
    );
  }

  return <GameScreen />;
};

export default Match;
