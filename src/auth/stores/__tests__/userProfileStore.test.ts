import { renderHook, act } from '@testing-library/react';
import { useUserProfileStore } from '../../user/stores/profile/profileStore';
import type { UserProfile, GameStats, UserPreferences, GameHistory } from '@/types/user/profile';

jest.mock('@/services/user', () => ({
  userService: {
    getUserProfile: jest.fn(),
    createUser: jest.fn(),
    updateUserStats: jest.fn(),
    updateUserPreferences: jest.fn(),
    addGameToHistory: jest.fn(),
    updateCurrentGame: jest.fn(),
    clearCurrentGame: jest.fn()
  }
}));

describe('UserProfileStore', () => {
  const mockUserProfile: UserProfile = {
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
      difficulty: 'medium',
      theme: 'dark',
      language: 'en'
    },
    gameHistory: [],
    achievements: []
  };

  beforeEach(() => {
    useUserProfileStore.setState({
      profile: null,
      isLoading: false,
      error: null
    });
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUserProfileStore());
    
    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load profile successfully', async () => {
    const { result } = renderHook(() => useUserProfileStore());
    const { userService } = await import('@/services/user/data');
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    await act(async () => {
      await result.current.loadProfile('test-uid');
    });

    expect(result.current.profile).toEqual(mockUserProfile);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle profile loading error', async () => {
    const { result } = renderHook(() => useUserProfileStore());
    const { userService } = await import('@/services/user/data');
    (userService.getUserProfile as jest.Mock).mockRejectedValue(new Error('Failed to load'));

    await act(async () => {
      await result.current.loadProfile('test-uid');
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to load');
  });

  it('should create profile successfully', async () => {
    const { result } = renderHook(() => useUserProfileStore());
    const { userService } = await import('@/services/user/data');
    (userService.createUser as jest.Mock).mockResolvedValue(undefined);
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    await act(async () => {
      await result.current.createProfile('test-uid', 'Test Player', true);
    });

    expect(result.current.profile).toEqual(mockUserProfile);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update stats successfully', async () => {
    const { result } = renderHook(() => useUserProfileStore());
    const { userService } = await import('@/services/user/data');
    
    await act(async () => {
      useUserProfileStore.setState({ profile: mockUserProfile });
    });
    
    (userService.updateUserStats as jest.Mock).mockResolvedValue(undefined);
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    const statsUpdate: Partial<GameStats> = { gamesWon: 4 };

    await act(async () => {
      await result.current.updateStats(statsUpdate);
    });

    expect(userService.updateUserStats).toHaveBeenCalledWith('test-uid', statsUpdate);
  });

  it('should update preferences successfully', async () => {
    const { result } = renderHook(() => useUserProfileStore());
    const { userService } = await import('@/services/user/data');
    
    await act(async () => {
      useUserProfileStore.setState({ profile: mockUserProfile });
    });
    
    (userService.updateUserPreferences as jest.Mock).mockResolvedValue(undefined);
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    const preferencesUpdate: Partial<UserPreferences> = { theme: 'light' };

    await act(async () => {
      await result.current.updatePreferences(preferencesUpdate);
    });

    expect(userService.updateUserPreferences).toHaveBeenCalledWith('test-uid', preferencesUpdate);
  });

  it('should add game to history successfully', async () => {
    const { result } = renderHook(() => useUserProfileStore());
    const { userService } = await import('@/services/user/data');
    
    await act(async () => {
      useUserProfileStore.setState({ profile: mockUserProfile });
    });
    
    (userService.addGameToHistory as jest.Mock).mockResolvedValue(undefined);
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

    const gameHistory: GameHistory = {
      gameId: 'game-1',
      timestamp: new Date(),
      result: 'win',
      duration: 300,
      shots: 20,
      hits: 15,
      accuracy: 75,
      opponentType: 'ai'
    };

    await act(async () => {
      await result.current.addGameToHistory(gameHistory);
    });

    expect(userService.addGameToHistory).toHaveBeenCalledWith('test-uid', gameHistory);
  });

  it('should set profile manually', () => {
    const { result } = renderHook(() => useUserProfileStore());

    act(() => {
      result.current.setProfile(mockUserProfile);
    });

    expect(result.current.profile).toEqual(mockUserProfile);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useUserProfileStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should set error state', () => {
    const { result } = renderHook(() => useUserProfileStore());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useUserProfileStore());
    
    act(() => {
      useUserProfileStore.setState({ 
        profile: mockUserProfile, 
        isLoading: true, 
        error: 'Test error' 
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
}); 