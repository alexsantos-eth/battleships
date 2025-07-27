import { renderHook, act } from '@testing-library/react';
import { useGameInitialization } from '../useGameInitialization';
import { useGameStore } from '@/stores/game';

jest.mock('@/stores/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('useGameInitialization', () => {
  const mockInitializeGame = jest.fn();
  const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInitializeGame.mockResolvedValue(undefined);
    mockUseGameStore.mockReturnValue({
      initializeGame: mockInitializeGame,
      isInitialized: false,
      resetGame: jest.fn(),
    } as ReturnType<typeof useGameStore>);
  });

  it('should return expected interface', () => {
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
    }));

    expect(result.current).toHaveProperty('initialize');
    expect(result.current).toHaveProperty('reset');
    expect(result.current).toHaveProperty('isInitialized');
    expect(result.current).toHaveProperty('isLoading');
    expect(typeof result.current.initialize).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.isInitialized).toBe('boolean');
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should start with correct initial state', () => {
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
    }));

    expect(result.current.isInitialized).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should call initializeGame when initialize is called', async () => {
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
    }));

    await act(async () => {
      await result.current.initialize();
    });

    expect(mockInitializeGame).toHaveBeenCalledTimes(1);
  });

  it('should handle initialization errors', async () => {
    const mockError = new Error('Initialization failed');
    mockInitializeGame.mockImplementation(() => {
      throw mockError;
    });

    const onError = jest.fn();
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
      onError,
    }));

    await act(async () => {
      try {
        await result.current.initialize();
      } catch {
        // Expected error
      }
    });

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('should reset state when reset is called', () => {
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
    }));

    act(() => {
      result.current.reset();
    });

    expect(result.current.isInitialized).toBe(false);
  });
}); 