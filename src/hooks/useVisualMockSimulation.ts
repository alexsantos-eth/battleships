import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { runMockSimulation } from '@/game/logic/examples/mockBattleSimulation';
import type { MockBattleResult } from '@/game/logic/examples/mockBattleSimulation';

export const useVisualMockSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationResult, setSimulationResult] = useState<MockBattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    setPlayerShips,
    setEnemyShips,
    addPlayerShot,
    addEnemyShot,
    setPlayerTurn,
    setEnemyTurn,
    initializeGame,
  } = useGameStore();

  const convertMockShipsToGameShips = useCallback((mockShips: MockBattleResult['shipPlacements']['player']) => {
    return mockShips.map(ship => ({
      coords: [ship.position.x, ship.position.y] as [number, number],
      variant: ship.variant,
      orientation: ship.orientation,
    }));
  }, []);

  const simulateShot = useCallback((shot: MockBattleResult['shotHistory'][0], delay: number = 500) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Calcular si es un hit usando la lógica del juego
        const isPlayerShot = shot.turn === 'PLAYER_TURN';
        
        // Invertir coordenadas para disparos del jugador (tablero del enemigo rotado)
        let adjustedX = shot.position.x;
        let adjustedY = shot.position.y;
        
        if (isPlayerShot) {
          // El tablero del enemigo está rotado 180°, invertir coordenadas
          adjustedX = 9 - shot.position.x;
          adjustedY = 9 - shot.position.y;
        }
        
        const { hit, shipId } = useGameStore.getState().checkShot(
          adjustedX,
          adjustedY,
          isPlayerShot
        );

        const gameShot = {
          x: adjustedX,
          y: adjustedY,
          hit: hit,
          shipId: shipId,
        };

        // Log con coordenadas corregidas para que coincida con la visualización
        console.log(`${shot.turn}: (${adjustedX}, ${adjustedY}) - ${hit ? '✅ Hit' : '❌ Miss'}`);

        if (shot.turn === 'PLAYER_TURN') {
          addPlayerShot(gameShot);
          setPlayerTurn(); // Emitir evento para animaciones
        } else {
          addEnemyShot(gameShot);
          setEnemyTurn(); // Emitir evento para animaciones
        }

        resolve();
      }, delay);
    });
  }, [addPlayerShot, addEnemyShot, setPlayerTurn, setEnemyTurn]);

  const runVisualSimulation = useCallback(async (type: 'player-win' | 'enemy-win' | 'quick' = 'quick') => {
    setIsSimulating(true);
    setError(null);
    setCurrentStep(0);
    
    try {
      const result = runMockSimulation(type);
      setSimulationResult(result);

      // Configurar los barcos en el juego
      const playerShips = convertMockShipsToGameShips(result.shipPlacements.player);
      const enemyShips = convertMockShipsToGameShips(result.shipPlacements.enemy);
      
      setPlayerShips(playerShips);
      setEnemyShips(enemyShips);
      
      // Inicializar el juego
      initializeGame();

      // Simular cada disparo con delay visual
      for (let i = 0; i < result.shotHistory.length; i++) {
        const shot = result.shotHistory[i];
        setCurrentStep(i + 1);
        
        // Delay más largo para hits para que se vea la explosión
        const shotDelay = shot.hit ? 1200 : 800;
        await simulateShot(shot, shotDelay);
      }

      console.log('🎯 Simulación visual completada!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSimulating(false);
    }
  }, [convertMockShipsToGameShips, setPlayerShips, setEnemyShips, initializeGame, simulateShot]);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setCurrentStep(0);
    setSimulationResult(null);
    setError(null);
    initializeGame();
  }, [initializeGame]);

  return {
    isSimulating,
    currentStep,
    simulationResult,
    error,
    runVisualSimulation,
    resetSimulation,
  };
}; 