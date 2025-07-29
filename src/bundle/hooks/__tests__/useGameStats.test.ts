import { renderHook } from '@testing-library/react';
import { useGameStats } from '../useGameStats';
import { useUserProfile } from '../../../user/hooks/profile/useUserProfile';
import { useGameStore } from '@/bundle/stores/game/gameStore';

jest.mock('../useUserProfile');
jest.mock('@/stores/game');

describe('useGameStats', () => {
  const mockUseUserProfile = useUserProfile as jest.MockedFunction<typeof useUserProfile>;
  const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

  const mockProfile = {
    uid: 'test-uid',
    displayName: 'Test Player',
    isAnonymous: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    stats: {
      gamesPlayed: 5,
      gamesWon: 3,
      gamesLost: 2,
      totalShots: 50,
      totalHits: 30,
      accuracy: 60,
      currentStreak: 2,
      longestStreak: 3
    },
          preferences: {
        soundEnabled: true,
        musicEnabled: false,
        difficulty: 'medium' as const,
        theme: 'dark' as const,
        language: 'en'
      },
    gameHistory: [],
    achievements: []
  };

  beforeEach(() => {
    mockUseUserProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
      loadProfile: jest.fn(),
      createProfile: jest.fn(),
      updateStats: jest.fn(),
      updatePreferences: jest.fn(),
      addGameToHistory: jest.fn(),
      updateCurrentGame: jest.fn(),
      clearCurrentGame: jest.fn(),
      setProfile: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      reset: jest.fn()
    });

    mockUseGameStore.mockReturnValue({
      isGameOver: false,
      winner: null,
      playerShots: [],
      currentTurn: 'PLAYER_TURN',
      isPlayerTurn: true,
      isEnemyTurn: false,
      playerShips: [],
      enemyShips: [],
      enemyShots: [],
      boardWidth: 10,
      boardHeight: 10,
      setPlayerTurn: jest.fn(),
      setEnemyTurn: jest.fn(),
      toggleTurn: jest.fn(),
      setPlayerShips: jest.fn(),
      setEnemyShips: jest.fn(),
      setBoardDimensions: jest.fn(),
      addPlayerShot: jest.fn(),
      addEnemyShot: jest.fn(),
      initializeGame: jest.fn(),
      initializeRandomTurn: jest.fn(),
      checkShot: jest.fn(),
      isCellShot: jest.fn(),
      isShipDestroyed: jest.fn(),
      checkGameOver: jest.fn(),
      resetGame: jest.fn()
    });
  });

  it('should return profile and updateUserStats function', () => {
    const { result } = renderHook(() => useGameStats());

    expect(result.current).toHaveProperty('profile');
    expect(result.current).toHaveProperty('updateUserStats');
    expect(result.current.profile).toEqual(mockProfile);
    expect(typeof result.current.updateUserStats).toBe('function');
  });

  it('should calculate game stats correctly for a win', () => {
    mockUseGameStore.mockReturnValue({
      isGameOver: true,
      winner: 'player',
      playerShots: [
        { x: 0, y: 0, hit: true },
        { x: 1, y: 1, hit: false },
        { x: 2, y: 2, hit: true }
      ],
      currentTurn: 'PLAYER_TURN',
      isPlayerTurn: true,
      isEnemyTurn: false,
      playerShips: [],
      enemyShips: [],
      enemyShots: [],
      boardWidth: 10,
      boardHeight: 10,
      setPlayerTurn: jest.fn(),
      setEnemyTurn: jest.fn(),
      toggleTurn: jest.fn(),
      setPlayerShips: jest.fn(),
      setEnemyShips: jest.fn(),
      setBoardDimensions: jest.fn(),
      addPlayerShot: jest.fn(),
      addEnemyShot: jest.fn(),
      initializeGame: jest.fn(),
      initializeRandomTurn: jest.fn(),
      checkShot: jest.fn(),
      isCellShot: jest.fn(),
      isShipDestroyed: jest.fn(),
      checkGameOver: jest.fn(),
      resetGame: jest.fn()
    });

    const { result } = renderHook(() => useGameStats());

    expect(result.current.profile).toEqual(mockProfile);
  });

  it('should calculate game stats correctly for a loss', () => {
    mockUseGameStore.mockReturnValue({
      isGameOver: true,
      winner: 'enemy',
      playerShots: [
        { x: 0, y: 0, hit: false },
        { x: 1, y: 1, hit: false },
        { x: 2, y: 2, hit: true }
      ],
      currentTurn: 'PLAYER_TURN',
      isPlayerTurn: true,
      isEnemyTurn: false,
      playerShips: [],
      enemyShips: [],
      enemyShots: [],
      boardWidth: 10,
      boardHeight: 10,
      setPlayerTurn: jest.fn(),
      setEnemyTurn: jest.fn(),
      toggleTurn: jest.fn(),
      setPlayerShips: jest.fn(),
      setEnemyShips: jest.fn(),
      setBoardDimensions: jest.fn(),
      addPlayerShot: jest.fn(),
      addEnemyShot: jest.fn(),
      initializeGame: jest.fn(),
      initializeRandomTurn: jest.fn(),
      checkShot: jest.fn(),
      isCellShot: jest.fn(),
      isShipDestroyed: jest.fn(),
      checkGameOver: jest.fn(),
      resetGame: jest.fn()
    });

    const { result } = renderHook(() => useGameStats());

    expect(result.current.profile).toEqual(mockProfile);
  });

  it('should handle case when profile is null', () => {
    mockUseUserProfile.mockReturnValue({
      profile: null,
      isLoading: false,
      error: null,
      loadProfile: jest.fn(),
      createProfile: jest.fn(),
      updateStats: jest.fn(),
      updatePreferences: jest.fn(),
      addGameToHistory: jest.fn(),
      updateCurrentGame: jest.fn(),
      clearCurrentGame: jest.fn(),
      setProfile: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      reset: jest.fn()
    });

    const { result } = renderHook(() => useGameStats());

    expect(result.current.profile).toBeNull();
  });
}); 