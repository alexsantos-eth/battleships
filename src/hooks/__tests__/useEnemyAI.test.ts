import { renderHook, act } from '@testing-library/react';
import { useEnemyAI } from '../useEnemyAI';
import { useGameStore } from '@/stores/game';

jest.mock('@/stores/game', () => ({
  useGameStore: jest.fn(),
}));

describe('useEnemyAI', () => {
  const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    mockUseGameStore.mockReturnValue({
      isEnemyTurn: false,
      isGameOver: false,
      boardWidth: 10,
      boardHeight: 10,
      isCellShot: jest.fn(() => false),
      checkShot: jest.fn(() => ({ hit: false })),
      addEnemyShot: jest.fn(),
      toggleTurn: jest.fn(),
    } as ReturnType<typeof useGameStore>);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be a function', () => {
    expect(typeof useEnemyAI).toBe('function');
  });

  it('should return expected interface', () => {
    const { result } = renderHook(() => useEnemyAI());

    expect(result.current).toHaveProperty('executeEnemyTurn');
    expect(result.current).toHaveProperty('generateRandomShot');
    expect(typeof result.current.executeEnemyTurn).toBe('function');
    expect(typeof result.current.generateRandomShot).toBe('function');
  });

  it('should not execute enemy turn when it is not enemy turn', () => {
    mockUseGameStore.mockReturnValue({
      isEnemyTurn: false,
      isGameOver: false,
      boardWidth: 10,
      boardHeight: 10,
      isCellShot: jest.fn(() => false),
      checkShot: jest.fn(() => ({ hit: false })),
      addEnemyShot: jest.fn(),
      toggleTurn: jest.fn(),
    } as ReturnType<typeof useGameStore>);

    renderHook(() => useEnemyAI());

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockUseGameStore().addEnemyShot).not.toHaveBeenCalled();
  });

  it('should not execute enemy turn when game is over', () => {
    mockUseGameStore.mockReturnValue({
      isEnemyTurn: true,
      isGameOver: true,
      boardWidth: 10,
      boardHeight: 10,
      isCellShot: jest.fn(() => false),
      checkShot: jest.fn(() => ({ hit: false })),
      addEnemyShot: jest.fn(),
      toggleTurn: jest.fn(),
    } as ReturnType<typeof useGameStore>);

    renderHook(() => useEnemyAI());

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockUseGameStore().addEnemyShot).not.toHaveBeenCalled();
  });

  it('should generate random shot from available positions', () => {
    const mockIsCellShot = jest.fn((x: number, y: number) => {
      return x === 0 && y === 0;
    });

    mockUseGameStore.mockReturnValue({
      isEnemyTurn: false,
      isGameOver: false,
      boardWidth: 2,
      boardHeight: 2,
      isCellShot: mockIsCellShot,
      checkShot: jest.fn(() => ({ hit: false })),
      addEnemyShot: jest.fn(),
      toggleTurn: jest.fn(),
    } as ReturnType<typeof useGameStore>);

    const { result } = renderHook(() => useEnemyAI());

    const shot = result.current.generateRandomShot();
    
    expect(shot).not.toBeNull();
    expect(shot).not.toEqual([0, 0]);
    expect(shot![0]).toBeGreaterThanOrEqual(0);
    expect(shot![0]).toBeLessThan(2);
    expect(shot![1]).toBeGreaterThanOrEqual(0);
    expect(shot![1]).toBeLessThan(2);
  });

  it('should return null when no available positions', () => {
    const mockIsCellShot = jest.fn(() => true);

    mockUseGameStore.mockReturnValue({
      isEnemyTurn: false,
      isGameOver: false,
      boardWidth: 2,
      boardHeight: 2,
      isCellShot: mockIsCellShot,
      checkShot: jest.fn(() => ({ hit: false })),
      addEnemyShot: jest.fn(),
      toggleTurn: jest.fn(),
    } as ReturnType<typeof useGameStore>);

    const { result } = renderHook(() => useEnemyAI());

    const shot = result.current.generateRandomShot();
    expect(shot).toBeNull();
  });
}); 