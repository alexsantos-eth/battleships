import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/game';
import { GameInitializer, type GameConfig } from '@/game/logic/gameInitializer';

export const useGameInitializer = () => {
  const [currentConfig, setCurrentConfig] = useState<GameConfig | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setPlayerShips,
    setEnemyShips,
    setBoardDimensions,
    resetGame: resetGameStore,
  } = useGameStore();

  const initializeCustomGame = useCallback((config: Partial<GameConfig>) => {
    setIsInitializing(true);
    setError(null);

    try {
      const initializer = new GameInitializer(config);
      const gameSetup = initializer.initializeGame();

      setPlayerShips(gameSetup.playerShips);
      setEnemyShips(gameSetup.enemyShips);
      setBoardDimensions(gameSetup.config.boardWidth, gameSetup.config.boardHeight);
      
      if (gameSetup.initialTurn === 'PLAYER_TURN') {
        useGameStore.getState().setPlayerTurn();
      } else {
        useGameStore.getState().setEnemyTurn();
      }

      setCurrentConfig(gameSetup.config);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al inicializar la partida';
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  }, [setPlayerShips, setEnemyShips, setBoardDimensions]);

  const initializeQuickGame = useCallback(() => {
    const config = GameInitializer.createQuickGameConfig();
    initializeCustomGame(config);
  }, [initializeCustomGame]);

  const initializeClassicGame = useCallback(() => {
    const config = GameInitializer.createClassicGameConfig();
    initializeCustomGame(config);
  }, [initializeCustomGame]);

  const initializeChallengingGame = useCallback(() => {
    const config = GameInitializer.createChallengingGameConfig();
    initializeCustomGame(config);
  }, [initializeCustomGame]);

  const restartCurrentGame = useCallback(() => {
    if (currentConfig) {
      initializeCustomGame(currentConfig);
    } else {
      initializeClassicGame();
    }
  }, [currentConfig, initializeCustomGame, initializeClassicGame]);

  const resetGame = useCallback(() => {
    resetGameStore();
    setCurrentConfig(null);
    setError(null);
  }, [resetGameStore]);

  return {
    currentConfig,
    isInitializing,
    error,
    initializeCustomGame,
    initializeQuickGame,
    initializeClassicGame,
    initializeChallengingGame,
    restartCurrentGame,
    resetGame,
    quickGameConfig: GameInitializer.createQuickGameConfig(),
    classicGameConfig: GameInitializer.createClassicGameConfig(),
    challengingGameConfig: GameInitializer.createChallengingGameConfig(),
  };
}; 