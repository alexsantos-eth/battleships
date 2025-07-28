import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { GameConfig } from "@/game/logic/gameInitializer";

export interface GameConfigurationState {
  gameConfig: Partial<GameConfig> | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useGameConfiguration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<GameConfigurationState>({
    gameConfig: null,
    isInitialized: false,
    isLoading: false,
    error: null,
  });

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

  const parseUrlParams = () => {
    const gridSize = parseInt(searchParams.get("gridSize") || "10");
    const shipsParam = searchParams.get("ships");
    const difficulty = searchParams.get("difficulty") || "medium";

    if (!shipsParam) {
      throw new Error("Parámetros de barcos no encontrados");
    }

    try {
      const ships = JSON.parse(shipsParam);
      return mapUrlParamsToGameConfig(gridSize, ships, difficulty);
    } catch {
      throw new Error("Error al parsear configuración de barcos");
    }
  };

  const initializeGameConfig = async (initializeGame: (config: Partial<GameConfig>) => void) => {
    if (state.isInitialized) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const config = parseUrlParams();
      setState(prev => ({ ...prev, gameConfig: config }));

      initializeGame(config);
      setState(prev => ({ 
        ...prev, 
        isInitialized: true, 
        isLoading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      navigate("/");
    }
  };

  const forceInitialization = async (initializeGame: (config: Partial<GameConfig>) => void) => {
    if (!state.gameConfig) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      initializeGame(state.gameConfig);
      setState(prev => ({ 
        ...prev, 
        isInitialized: true, 
        isLoading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
    }
  };

  return {
    ...state,
    initializeGameConfig,
    forceInitialization,
    mapUrlParamsToGameConfig,
    parseUrlParams,
  };
}; 