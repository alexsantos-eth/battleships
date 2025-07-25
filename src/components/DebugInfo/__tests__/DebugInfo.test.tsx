import { DebugInfo } from '../index';
import { DEBUG_CONFIG } from '@/utils/debug';

// Mock the hooks and stores
jest.mock('@/hooks/useGameState', () => ({
  useGameState: () => ({
    currentTurn: 'player',
    playerShips: [
      {
        coords: [0, 0] as [number, number],
        variant: 'small' as const,
        orientation: 'horizontal' as const,
      }
    ],
    enemyShips: [],
    initializeGame: jest.fn(),
    getShipSize: jest.fn(() => 2),
    getShipCells: jest.fn(() => [[0, 0], [0, 1]]),
  }),
}));

jest.mock('@/config/colors', () => ({
  COLORS: {
    ui: {
      debug: {
        background: '#000000',
        border: '#ffffff',
        button: '#333333',
      },
    },
  },
}));

describe('DebugInfo', () => {
  it('should be a function component', () => {
    expect(typeof DebugInfo).toBe('function');
  });

  it('should use DEBUG_CONFIG for configuration', () => {
    expect(DEBUG_CONFIG).toHaveProperty('ENABLE_DEBUG_INFO');
    expect(DEBUG_CONFIG).toHaveProperty('DEBUG_INFO_POSITION');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_SHIP_DETAILS');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_CELL_COORDINATES');
    expect(DEBUG_CONFIG).toHaveProperty('SHOW_GAME_STATE');
    expect(DEBUG_CONFIG).toHaveProperty('DEBUG_INFO_MAX_WIDTH');
    expect(DEBUG_CONFIG).toHaveProperty('DEBUG_INFO_MAX_HEIGHT');
  });

  it('should have valid DEBUG_INFO_POSITION value', () => {
    const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    expect(validPositions).toContain(DEBUG_CONFIG.DEBUG_INFO_POSITION);
  });

  it('should have reasonable DEBUG_INFO_MAX_WIDTH value', () => {
    expect(DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH).toBeGreaterThan(0);
    expect(DEBUG_CONFIG.DEBUG_INFO_MAX_WIDTH).toBeLessThanOrEqual(1000);
  });

  it('should have valid DEBUG_INFO_MAX_HEIGHT value', () => {
    expect(DEBUG_CONFIG.DEBUG_INFO_MAX_HEIGHT).toMatch(/^\d+vh$/);
  });

  it('should have boolean configuration flags', () => {
    expect(typeof DEBUG_CONFIG.ENABLE_DEBUG_INFO).toBe('boolean');
    expect(typeof DEBUG_CONFIG.SHOW_SHIP_DETAILS).toBe('boolean');
    expect(typeof DEBUG_CONFIG.SHOW_CELL_COORDINATES).toBe('boolean');
    expect(typeof DEBUG_CONFIG.SHOW_GAME_STATE).toBe('boolean');
  });
}); 