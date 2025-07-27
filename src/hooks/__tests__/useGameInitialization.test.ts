import { renderHook, act } from '@testing-library/react';
import { useGameInitialization } from '../useGameInitialization';
import { useGameStore } from '@/stores/gameStore';

jest.mock('@/stores/gameStore', () => ({
  useGameStore: jest.fn(),
}));

describe('useGameInitialization', () => {
  const mockInitializeGame = jest.fn();
  const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGameStore.mockReturnValue({
      initializeGame: mockInitializeGame,
    } as ReturnType<typeof useGameStore>);
  });

  it('should initialize game only once when called multiple times', async () => {
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
    }));

    await act(async () => {
      await result.current.initialize();
      await result.current.initialize();
      await result.current.initialize();
    });

    expect(mockInitializeGame).toHaveBeenCalledTimes(1);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should handle initialization errors gracefully', async () => {
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
    expect(result.current.isInitialized).toBe(false);
  });

  it('should reset initialization state when reset is called', async () => {
    const { result } = renderHook(() => useGameInitialization({
      autoInitialize: false,
    }));

    await act(async () => {
      await result.current.initialize();
    });

    expect(result.current.isInitialized).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isInitialized).toBe(false);
  });

  it('should auto-initialize when autoInitialize is true', async () => {
    renderHook(() => useGameInitialization({
      autoInitialize: true,
    }));

    expect(mockInitializeGame).toHaveBeenCalledTimes(1);
  });
}); 