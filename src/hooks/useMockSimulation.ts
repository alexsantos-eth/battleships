import { useState } from 'react';
import { runMockSimulation, type MockBattleResult } from '@/simulations';

export const useMockSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<MockBattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (type: 'player-win' | 'enemy-win' | 'quick' | 'random' = 'quick') => {
    setIsRunning(true);
    setError(null);
    
    try {
      const result = runMockSimulation(type);
      setLastResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsRunning(false);
    }
  };

  const clearResult = () => {
    setLastResult(null);
    setError(null);
  };

  return {
    isRunning,
    lastResult,
    error,
    runSimulation,
    clearResult
  };
}; 