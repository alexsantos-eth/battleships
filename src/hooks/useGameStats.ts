import { useUserProfile } from './useUserProfile';
import { useGameStore } from '@/stores/gameStore';
import { useEffect } from 'react';
import type { GameHistory } from '@/types/user';

export const useGameStats = () => {
  const { profile, updateStats, addGameToHistory } = useUserProfile();
  const { 
    isGameOver, 
    winner, 
    playerShots
  } = useGameStore();

  const calculateGameStats = () => {
    if (!isGameOver || !winner) return null;

    const totalShots = playerShots.length;
    const totalHits = playerShots.filter(shot => shot.hit).length;
    const accuracy = totalShots > 0 ? (totalHits / totalShots) * 100 : 0;
    const gameResult = winner === 'player' ? 'win' as const : 'loss' as const;

    return {
      totalShots,
      totalHits,
      accuracy,
      result: gameResult
    };
  };

  const updateUserStats = async () => {
    if (!profile || !isGameOver || !winner) return;

    const gameStats = calculateGameStats();
    if (!gameStats) return;

    const newStats = {
      gamesPlayed: profile.stats.gamesPlayed + 1,
      gamesWon: profile.stats.gamesWon + (gameStats.result === 'win' ? 1 : 0),
      gamesLost: profile.stats.gamesLost + (gameStats.result === 'loss' ? 1 : 0),
      totalShots: profile.stats.totalShots + gameStats.totalShots,
      totalHits: profile.stats.totalHits + gameStats.totalHits,
      accuracy: profile.stats.totalShots + gameStats.totalShots > 0 
        ? ((profile.stats.totalHits + gameStats.totalHits) / (profile.stats.totalShots + gameStats.totalShots)) * 100 
        : 0
    };

    await updateStats(newStats);

    const gameHistory: GameHistory = {
      gameId: `game_${Date.now()}`,
      timestamp: new Date(),
      result: gameStats.result,
              duration: 0,
      shots: gameStats.totalShots,
      hits: gameStats.totalHits,
      accuracy: gameStats.accuracy,
      opponentType: 'ai'
    };

    await addGameToHistory(gameHistory);
  };

  useEffect(() => {
    if (isGameOver && winner) {
      updateUserStats();
    }
  }, [isGameOver, winner]);

  return {
    profile,
    updateUserStats
  };
}; 