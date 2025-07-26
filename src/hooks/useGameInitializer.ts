import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
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

  /**
   * Inicializa una partida con configuración personalizada
   */
  const initializeCustomGame = useCallback((config: Partial<GameConfig>) => {
    setIsInitializing(true);
    setError(null);

    try {
      const initializer = new GameInitializer(config);
      const gameSetup = initializer.initializeGame();

      // Aplicar la configuración al juego
      setPlayerShips(gameSetup.playerShips);
      setEnemyShips(gameSetup.enemyShips);
      setBoardDimensions(gameSetup.config.boardWidth, gameSetup.config.boardHeight);
      
      // Establecer el turno inicial
      if (gameSetup.initialTurn === 'PLAYER_TURN') {
        useGameStore.getState().setPlayerTurn();
      } else {
        useGameStore.getState().setEnemyTurn();
      }

      setCurrentConfig(gameSetup.config);
      
      console.log('🎮 Partida inicializada con configuración:', gameSetup.config);
      console.log('🚢 Barcos del jugador:', gameSetup.playerShips.length);
      console.log('🚢 Barcos del enemigo:', gameSetup.enemyShips.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al inicializar la partida';
      setError(errorMessage);
      console.error('❌ Error al inicializar partida:', err);
    } finally {
      setIsInitializing(false);
    }
  }, [setPlayerShips, setEnemyShips, setBoardDimensions]);

  /**
   * Inicializa una partida rápida
   */
  const initializeQuickGame = useCallback(() => {
    const config = GameInitializer.createQuickGameConfig();
    initializeCustomGame(config);
  }, [initializeCustomGame]);

  /**
   * Inicializa una partida clásica
   */
  const initializeClassicGame = useCallback(() => {
    const config = GameInitializer.createClassicGameConfig();
    initializeCustomGame(config);
  }, [initializeCustomGame]);

  /**
   * Inicializa una partida desafiante
   */
  const initializeChallengingGame = useCallback(() => {
    const config = GameInitializer.createChallengingGameConfig();
    initializeCustomGame(config);
  }, [initializeCustomGame]);

  /**
   * Reinicia la partida actual
   */
  const restartCurrentGame = useCallback(() => {
    if (currentConfig) {
      initializeCustomGame(currentConfig);
    } else {
      // Si no hay configuración actual, usar la clásica
      initializeClassicGame();
    }
  }, [currentConfig, initializeCustomGame, initializeClassicGame]);

  /**
   * Reinicia completamente el juego
   */
  const resetGame = useCallback(() => {
    resetGameStore();
    setCurrentConfig(null);
    setError(null);
  }, [resetGameStore]);

  return {
    // Estado
    currentConfig,
    isInitializing,
    error,
    
    // Acciones
    initializeCustomGame,
    initializeQuickGame,
    initializeClassicGame,
    initializeChallengingGame,
    restartCurrentGame,
    resetGame,
    
    // Configuraciones predefinidas
    quickGameConfig: GameInitializer.createQuickGameConfig(),
    classicGameConfig: GameInitializer.createClassicGameConfig(),
    challengingGameConfig: GameInitializer.createChallengingGameConfig(),
  };
}; 