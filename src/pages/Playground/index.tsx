import { useEffect, useState } from "react";

import { UnifiedDebugPanel } from "@/components/debug/UnifiedDebugPanel";
import { GameGrid } from "@/components/features/GameGrid";
import EnvironmentBox from "@/env";
import { useGameStore } from "@/stores/game";

import type { GameConfig } from "@/game/logic/gameInitializer";
const Playground = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlayerBoard, setShowPlayerBoard] = useState(true);
  const [showEnemyBoard, setShowEnemyBoard] = useState(true);
  const [showShips, setShowShips] = useState(true);
  const [showShots, setShowShots] = useState(true);
  const [alwaysShowEnemyShips, setAlwaysShowEnemyShips] = useState(true);

  const { initializeGame } = useGameStore();

  const defaultConfig: Partial<GameConfig> = {
    boardWidth: 10,
    boardHeight: 10,
    shipCounts: {
      small: 2,
      medium: 2,
      large: 1,
      xlarge: 1,
    },
    enemyAI: "random",
    initialTurn: "player",
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsLoading(true);
      try {
        initializeGame(defaultConfig);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error al inicializar el juego:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isInitialized, initializeGame]);

  if (isLoading || !isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🚀 Armada.io Playground
          </h2>
          <p className="text-purple-200 mb-4">
            Inicializando entorno de experimentación...
          </p>
          <button
            onClick={() => {
              setIsLoading(true);
              try {
                initializeGame(defaultConfig);
                setIsInitialized(true);
              } catch (error) {
                console.error("Error:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Forzar Inicialización
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <EnvironmentBox>
        {showPlayerBoard && (
          <GameGrid
            isPlayerBoard={true}
            showShips={showShips}
            showShots={showShots}
            alwaysShowEnemyShips={alwaysShowEnemyShips}
          />
        )}
        {showEnemyBoard && (
          <GameGrid
            isPlayerBoard={false}
            enablePressGrid={false}
            rotation={[0, 0, Math.PI]}
            position={[0, 9, 0]}
            showShips={showShips}
            showShots={showShots}
            alwaysShowEnemyShips={alwaysShowEnemyShips}
          />
        )}
      </EnvironmentBox>

      <UnifiedDebugPanel
        showPlayerBoard={showPlayerBoard}
        setShowPlayerBoard={setShowPlayerBoard}
        showEnemyBoard={showEnemyBoard}
        setShowEnemyBoard={setShowEnemyBoard}
        showShips={showShips}
        setShowShips={setShowShips}
        showShots={showShots}
        setShowShots={setShowShots}
        alwaysShowEnemyShips={alwaysShowEnemyShips}
        setAlwaysShowEnemyShips={setAlwaysShowEnemyShips}
      />
    </>
  );
};

export default Playground;
