import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import GameGrid from "@/components/GameGrid";
import { DebugPanel } from "@/components/DebugPanel";
import { GameOverModal } from "@/components/GameOverModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import EnvironmentBox from "@/env";
import UIBox from "@/ui";
import type { GameConfig } from "@/game/logic/gameInitializer";
import { useGameStore } from "@/stores/gameStore";
import { useEnemyAI } from "@/hooks/useEnemyAI";

const Match = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gameConfig, setGameConfig] = useState<Partial<GameConfig> | null>(null);

  const mapUrlParamsToGameConfig = (gridSize: number, ships: Record<string, number>, difficulty: string): Partial<GameConfig> => {
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

    console.log("Parámetros de URL:", { gridSize, shipsParam, difficulty });

    if (!shipsParam) {
      console.error("Parámetros de barcos no encontrados");
      navigate("/");
      return;
    }

    try {
      const ships = JSON.parse(shipsParam);
      console.log("Barcos parseados:", ships);
      const config = mapUrlParamsToGameConfig(gridSize, ships, difficulty);
      console.log("Configuración generada:", config);
      
      setGameConfig(config);
      console.log("Configuración establecida");
      
      if (!isInitialized) {
        console.log("Inicializando juego inmediatamente con configuración:", config);
        setIsLoading(true);
        
        setTimeout(() => {
          try {
            initializeGame(config);
            console.log("Juego inicializado exitosamente");
            setIsInitialized(true);
          } catch (error) {
            console.error("Error al inicializar el juego:", error);
            navigate("/");
          } finally {
            setIsLoading(false);
          }
        }, 200);
      }
    } catch (error) {
      console.error("Error al parsear configuración de barcos:", error);
      navigate("/");
    }
  }, [searchParams, navigate, isInitialized, initializeGame]);

  const handleBackToHome = () => {
    navigate("/");
  };

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
              console.log("Forzando inicialización...");
              setIsLoading(true);
              setTimeout(() => {
                try {
                  initializeGame(gameConfig);
                  setIsInitialized(true);
                } catch (error) {
                  console.error("Error:", error);
                } finally {
                  setIsLoading(false);
                }
              }, 100);
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
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBackToHome}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          ← Volver al inicio
        </button>
      </div>

      <EnvironmentBox>
        <GameGrid isPlayerBoard={true} />
        <GameGrid
          isPlayerBoard={false}
          enablePressGrid
          rotation={[0, 0, Math.PI]}
          position={[0, 9, 0]}
        />
      </EnvironmentBox>
      <UIBox />

      <DebugPanel />
      
      <GameOverModal />
    </>
  );
};

export default Match; 