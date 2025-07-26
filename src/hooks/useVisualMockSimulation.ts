import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { runMockSimulation } from '@/game/logic/examples/mockBattleSimulation';
import type { MockBattleResult } from '@/game/logic/examples/mockBattleSimulation';
import { CoordinateUtils } from "@/utils/coordinates";


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
        const isPlayerShot = shot.turn === 'PLAYER_TURN';
        // Usar coordenadas lógicas directamente
        const logicalPos = { x: shot.position.x, y: shot.position.y };
        const { hit, shipId } = useGameStore.getState().checkShot(
          logicalPos.x,
          logicalPos.y,
          isPlayerShot
        );
        const gameShot = {
          x: logicalPos.x,
          y: logicalPos.y,
          hit: hit,
          shipId: shipId,
        };
        if (shot.turn === 'PLAYER_TURN') {
          addPlayerShot(gameShot);
          setPlayerTurn();
        } else {
          addEnemyShot(gameShot);
          setEnemyTurn();
        }
        resolve();
      }, delay);
    });
  }, [addPlayerShot, addEnemyShot, setPlayerTurn, setEnemyTurn]);

  const simulateQuickShot = useCallback((shot: { turn: 'PLAYER_TURN' | 'ENEMY_TURN', position: { x: number, y: number }, hit: boolean, shipDestroyed: boolean }, delay: number = 500) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const isPlayerShot = shot.turn === 'PLAYER_TURN';
        // Usar coordenadas lógicas directamente
        const logicalPos = { x: shot.position.x, y: shot.position.y };
        const { hit, shipId } = useGameStore.getState().checkShot(
          logicalPos.x,
          logicalPos.y,
          isPlayerShot
        );
        const gameShot = {
          x: logicalPos.x,
          y: logicalPos.y,
          hit: hit,
          shipId: shipId,
        };
        if (shot.turn === 'PLAYER_TURN') {
          addPlayerShot(gameShot);
          setPlayerTurn();
        } else {
          addEnemyShot(gameShot);
          setEnemyTurn();
        }
        resolve();
      }, delay);
    });
  }, [addPlayerShot, addEnemyShot, setPlayerTurn, setEnemyTurn]);

  const runQuickGameOverSimulation = useCallback(async (winner: 'player' | 'enemy') => {
    setIsSimulating(true);
    setError(null);
    setCurrentStep(0);
    
    try {
      // Crear barcos basados en lo que veo en la imagen
      const playerShips = [
        { coords: [0, 0] as [number, number], variant: 'small' as const, orientation: 'horizontal' as const },
      ];
      
      // El barco enemigo aparece vertical en [0,0] y [0,1] visualmente
      const enemyShips = [
        { coords: [0, 0] as [number, number], variant: 'small' as const, orientation: 'vertical' as const },
      ];
      
      console.log('🚢 Barcos del jugador:', playerShips);
      console.log('🚢 Barcos del enemigo:', enemyShips);
      
      // Debug: mostrar las celdas de cada barco
      console.log('🔍 Debug - Celdas de los barcos:');
      enemyShips.forEach((ship, index) => {
        const shipSize = ship.variant === 'small' ? 2 : ship.variant === 'medium' ? 3 : ship.variant === 'large' ? 4 : 5;
        const cells = CoordinateUtils.getShipCells(ship.coords, ship.orientation, shipSize);
        console.log(`  Barco enemigo ${index}: ${cells.map(cell => `[${cell.x},${cell.y}]`).join(', ')}`);
      });
      
      setPlayerShips(playerShips);
      setEnemyShips(enemyShips);
      initializeGame();

      // Crear disparos basados en lo que veo en la imagen
      const shots = [];
      
      if (winner === 'player') {
        // Disparos del jugador para destruir barcos enemigos
        // Basado en la imagen, el barco está en [0,0] y [0,1] verticalmente
        // Los disparos exitosos aparecen exactamente en esas posiciones
        shots.push(
          { turn: 'PLAYER_TURN' as const, position: { x: 0, y: 0 }, hit: true, shipDestroyed: false },
          { turn: 'PLAYER_TURN' as const, position: { x: 0, y: 1 }, hit: true, shipDestroyed: true },
        );
      } else {
        // Disparos del enemigo para destruir barcos del jugador
        shots.push(
          { turn: 'ENEMY_TURN' as const, position: { x: 0, y: 0 }, hit: true, shipDestroyed: false },
          { turn: 'ENEMY_TURN' as const, position: { x: 1, y: 0 }, hit: true, shipDestroyed: true },
        );
      }

      console.log('🎯 Disparos configurados:', shots);

      // Simular cada disparo con delay visual
      for (let i = 0; i < shots.length; i++) {
        const shot = shots[i];
        setCurrentStep(i + 1);
        
        // Delay más largo para hits para que se vea la explosión
        const shotDelay = shot.hit ? 1000 : 600;
        await simulateQuickShot(shot, shotDelay);
      }

      console.log(`🎯 Simulación visual de fin de juego completada! Ganador: ${winner}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSimulating(false);
    }
  }, [setPlayerShips, setEnemyShips, initializeGame, simulateQuickShot]);

  const runVisualSimulation = useCallback(async (type: 'player-win' | 'enemy-win' | 'quick' | 'random' = 'quick') => {
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
    runQuickGameOverSimulation,
    resetSimulation,
  };
}; 