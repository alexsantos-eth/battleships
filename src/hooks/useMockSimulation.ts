import { useState } from 'react';
import { runMockSimulation } from '@/game/logic/examples/mockBattleSimulation';
import type { MockBattleResult } from '@/game/logic/examples/mockBattleSimulation';

export const useMockSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<MockBattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (type: 'player-win' | 'enemy-win' | 'quick' = 'quick') => {
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