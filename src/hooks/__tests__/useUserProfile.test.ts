import { renderHook } from '@testing-library/react';
import { useUserProfile } from '../useUserProfile';
import { useUserProfileStore } from '@/stores/userProfile';

jest.mock('@/stores/userProfileStore');

describe('useUserProfile', () => {
  const mockUseUserProfileStore = useUserProfileStore as jest.MockedFunction<typeof useUserProfileStore>;

  beforeEach(() => {
    mockUseUserProfileStore.mockReturnValue({
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
  });

  it('should return user profile state and methods', () => {
    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toHaveProperty('profile');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('loadProfile');
    expect(result.current).toHaveProperty('createProfile');
    expect(result.current).toHaveProperty('updateStats');
    expect(result.current).toHaveProperty('updatePreferences');
    expect(result.current).toHaveProperty('addGameToHistory');
    expect(result.current).toHaveProperty('updateCurrentGame');
    expect(result.current).toHaveProperty('clearCurrentGame');
    expect(result.current).toHaveProperty('setProfile');
    expect(result.current).toHaveProperty('setLoading');
    expect(result.current).toHaveProperty('setError');
    expect(result.current).toHaveProperty('reset');
  });

  it('should return profile data when available', () => {
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
        difficulty: 'medium',
        theme: 'dark',
        language: 'en'
      },
      gameHistory: [],
      achievements: []
    };

    mockUseUserProfileStore.mockReturnValue({
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

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return loading state when loading', () => {
    mockUseUserProfileStore.mockReturnValue({
      profile: null,
      isLoading: true,
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

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.isLoading).toBe(true);
  });

  it('should return error state when error exists', () => {
    mockUseUserProfileStore.mockReturnValue({
      profile: null,
      isLoading: false,
      error: 'Test error',
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

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.error).toBe('Test error');
  });
}); 