import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { UnifiedDebugPanel } from "@/components/debug/UnifiedDebugPanel";
import { GameGrid } from "@/components/features/GameGrid";
import { GameOverModal } from "@/components/layouts/GameOverModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import EnvironmentBox from "@/env";
import { useEnemyAI } from "@/hooks/useEnemyAI";
import { useGameStore } from "@/stores/game";

import type { GameConfig } from "@/game/logic/gameInitializer";
const Match = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gameConfig, setGameConfig] = useState<Partial<GameConfig> | null>(
    null
  );

  const mapUrlParamsToGameConfig = (
    gridSize: number,
    ships: Record<string, number>,
    difficulty: string
  ): Partial<GameConfig> => {
    const shipCounts = {
      small: ships.small || 1,
      medium: ships.medium || 1,
      large: ships.large || 1,
      xlarge: ships.xlarge || 1,
    };

    const enemyAI = difficulty === "hard" ? "smart" : "random";
    const initialTurn = difficulty === "hard" ? "enemy" : "random";

    return {
      boardWidth: gridSize,
      boardHeight: gridSize,
      shipCounts,
      enemyAI,
      initialTurn,
    };
  };

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { initializeGame } = useGameStore();

  useEnemyAI();

  useEffect(() => {
    const gridSize = parseInt(searchParams.get("gridSize") || "10");
    const shipsParam = searchParams.get("ships");
    const difficulty = searchParams.get("difficulty") || "medium";

    if (!shipsParam) {
      console.error("Parámetros de barcos no encontrados");
      navigate("/");
      return;
    }

    try {
      const ships = JSON.parse(shipsParam);
      const config = mapUrlParamsToGameConfig(gridSize, ships, difficulty);

      setGameConfig(config);

      if (!isInitialized) {
        setIsLoading(true);

        try {
          initializeGame(config);
          setIsInitialized(true);
        } catch (error) {
          console.error("Error al inicializar el juego:", error);
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error al parsear configuración de barcos:", error);
      navigate("/");
    }
  }, [searchParams, navigate, isInitialized, initializeGame]);

  if (!gameConfig) {
    return <LoadingScreen message="Cargando configuración..." />;
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Armada.io</h2>
          <p className="text-blue-200 mb-4">Preparando la batalla naval...</p>
          <div className="text-sm text-blue-300 space-y-2">
            <p>Estado: {isLoading ? "Cargando" : "No cargando"}</p>
            <p>Inicializado: {isInitialized ? "Sí" : "No"}</p>
            <p>Configuración: {gameConfig ? "Lista" : "No lista"}</p>
          </div>
          <button
            onClick={() => {
              setIsLoading(true);
              try {
                initializeGame(gameConfig);
                setIsInitialized(true);
              } catch (error) {
                console.error("Error:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
        <GameGrid isPlayerBoard={true} />
        <GameGrid
          isPlayerBoard={false}
          enablePressGrid
          rotation={[0, 0, Math.PI]}
          position={[0, 9, 0]}
        />
      </EnvironmentBox>

      <UnifiedDebugPanel />

      <GameOverModal />
    </>
  );
};

export default Match;
