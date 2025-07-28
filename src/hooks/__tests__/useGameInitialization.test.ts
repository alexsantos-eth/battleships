import { renderHook, act } from '@testing-library/react';
import { useGameInitialization } from '../useGameInitialization';
import { useGameStore } from '@/stores/game';

jest.mock('@/stores/game', () => ({
  useGameStore: jest.fn(),
}));

describe('useGameInitialization', () => {
  const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;
  let mockInitializeGame: jest.Mock;

  beforeEach(() => {
    mockInitializeGame = jest.fn();
    mockUseGameStore.mockReturnValue({
      initializeGame: mockInitializeGame,
    } as ReturnType<typeof useGameStore>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should return expected interface', () => {
      const { result } = renderHook(() => useGameInitialization({ autoInitialize: false }));

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
      const { result } = renderHook(() => useGameInitialization({ autoInitialize: false }));

      expect(result.current.isInitialized).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize game with default config', async () => {
      const { result } = renderHook(() => useGameInitialization({ autoInitialize: false }));

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockInitializeGame).toHaveBeenCalledWith(undefined);
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize game with custom config', async () => {
      const customConfig = {
        boardWidth: 8,
        boardHeight: 8,
        shipCounts: {
          small: 2,
          medium: 1,
          large: 0,
          xlarge: 0,
        },
        initialTurn: 'player' as const,
        enemyAI: 'basic' as const,
      };

      const { result } = renderHook(() => useGameInitialization({ 
        config: customConfig, 
        autoInitialize: false 
      }));

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockInitializeGame).toHaveBeenCalledWith(customConfig);
    });

    it('should handle initialization errors gracefully', async () => {
      const mockError = new Error('Invalid configuration');
      mockInitializeGame.mockImplementation(() => {
        throw mockError;
      });

      const onError = jest.fn();
      const { result } = renderHook(() => useGameInitialization({ 
        autoInitialize: false, 
        onError 
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
      expect(result.current.isLoading).toBe(false);
    });

    it('should not reinitialize if already initialized', async () => {
      const { result } = renderHook(() => useGameInitialization({ autoInitialize: false }));

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockInitializeGame).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockInitializeGame).toHaveBeenCalledTimes(1);
    });

    it('should reset state when reset is called', async () => {
      const { result } = renderHook(() => useGameInitialization({ autoInitialize: false }));

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isInitialized).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isInitialized).toBe(false);
    });
  });

  describe('auto initialization', () => {
    it('should auto initialize by default', async () => {
      renderHook(() => useGameInitialization());

      expect(mockInitializeGame).toHaveBeenCalled();
    });

    it('should not auto initialize when disabled', () => {
      renderHook(() => useGameInitialization({ autoInitialize: false }));

      expect(mockInitializeGame).not.toHaveBeenCalled();
    });

    it('should call onInitialized callback when successful', async () => {
      const onInitialized = jest.fn();
      
      renderHook(() => useGameInitialization({ onInitialized }));

      await act(async () => {
        // Wait for auto initialization
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onInitialized).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid initialization calls', async () => {
      const { result } = renderHook(() => useGameInitialization({ autoInitialize: false }));

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockInitializeGame).toHaveBeenCalledTimes(1);
    });
  });
}); 