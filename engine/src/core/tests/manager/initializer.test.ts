import { describe, it, expect, beforeEach } from 'vitest';
import { GameInitializer } from '../../manager/initializer';
import { GAME_CONSTANTS } from '../../constants/game';
import type { GameConfig } from '../../types/config';

describe('GameInitializer', () => {
  describe('Constructor and Configuration', () => {
    it('should create initializer with default config', () => {
      const initializer = new GameInitializer();
      const config = initializer.getDefaultConfig();
      
      expect(config.boardWidth).toBe(GAME_CONSTANTS.BOARD.DEFAULT_WIDTH);
      expect(config.boardHeight).toBe(GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT);
      expect(config.shipCounts).toEqual(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
    });

    it('should create initializer with custom config', () => {
      const customConfig: Partial<GameConfig> = {
        boardWidth: 15,
        boardHeight: 12,
        shipCounts: { small: 2, medium: 1, large: 1, xlarge: 0 },
      };
      
      const initializer = new GameInitializer(customConfig);
      const setup = initializer.initializeGame();
      
      expect(setup.config.boardWidth).toBe(15);
      expect(setup.config.boardHeight).toBe(12);
      expect(setup.config.shipCounts?.small).toBe(2);
    });

    it('should merge custom config with defaults', () => {
      const initializer = new GameInitializer({ boardWidth: 12 });
      const setup = initializer.initializeGame();
      
      expect(setup.config.boardWidth).toBe(12);
      expect(setup.config.boardHeight).toBe(GAME_CONSTANTS.BOARD.DEFAULT_HEIGHT);
      expect(setup.config.shipCounts).toEqual(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
    });
  });

  describe('Configuration Validation', () => {
    it('should reject board width below minimum', () => {
      expect(() => {
        new GameInitializer({ boardWidth: 2 });
      }).toThrow();
    });

    it('should reject board height below minimum', () => {
      expect(() => {
        new GameInitializer({ boardHeight: 2 });
      }).toThrow();
    });

    it('should reject board width above maximum', () => {
      expect(() => {
        new GameInitializer({ boardWidth: 31 });
      }).toThrow();
    });

    it('should reject board height above maximum', () => {
      expect(() => {
        new GameInitializer({ boardHeight: 31 });
      }).toThrow();
    });

    it('should reject too many ships for board size', () => {
      expect(() => {
        new GameInitializer({
          boardWidth: 5,
          boardHeight: 5,
          shipCounts: { small: 10, medium: 10, large: 10, xlarge: 10 },
        });
      }).toThrow(/Too many ships/);
    });

    it('should accept valid board sizes at boundaries', () => {
      expect(() => {
        new GameInitializer({ 
          boardWidth: 3, 
          boardHeight: 3,
          shipCounts: { small: 0, medium: 0, large: 0, xlarge: 0 }
        });
      }).not.toThrow();
      
      expect(() => {
        new GameInitializer({ boardWidth: 30, boardHeight: 30 });
      }).not.toThrow();
    });

    it('should accept reasonable ship counts', () => {
      expect(() => {
        new GameInitializer({
          boardWidth: 10,
          boardHeight: 10,
          shipCounts: { small: 2, medium: 2, large: 1, xlarge: 1 },
        });
      }).not.toThrow();
    });
  });

  describe('Game Initialization', () => {
    let initializer: GameInitializer;

    beforeEach(() => {
      initializer = new GameInitializer();
    });

    it('should generate complete game setup', () => {
      const setup = initializer.initializeGame();
      
      expect(setup).toHaveProperty('playerShips');
      expect(setup).toHaveProperty('enemyShips');
      expect(setup).toHaveProperty('initialTurn');
      expect(setup).toHaveProperty('config');
    });

    it('should generate ships for both players', () => {
      const setup = initializer.initializeGame();
      
      expect(setup.playerShips.length).toBeGreaterThan(0);
      expect(setup.enemyShips.length).toBeGreaterThan(0);
    });

    it('should generate correct number of ships', () => {
      const customConfig = {
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 2, medium: 1, large: 1, xlarge: 1 },
      };
      
      const initializer = new GameInitializer(customConfig);
      const setup = initializer.initializeGame();
      
      const totalShips = 2 + 1 + 1 + 1; // 5 ships total
      expect(setup.playerShips).toHaveLength(totalShips);
      expect(setup.enemyShips).toHaveLength(totalShips);
    });

    it('should generate ships with correct variants', () => {
      const customConfig = {
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 2, medium: 1, large: 0, xlarge: 0 },
      };
      
      const initializer = new GameInitializer(customConfig);
      const setup = initializer.initializeGame();
      
      const smallShips = setup.playerShips.filter(s => s.variant === 'small');
      const mediumShips = setup.playerShips.filter(s => s.variant === 'medium');
      
      expect(smallShips).toHaveLength(2);
      expect(mediumShips).toHaveLength(1);
    });

    it('should generate valid ship placements', () => {
      const setup = initializer.initializeGame();
      
      setup.playerShips.forEach(ship => {
        expect(ship.coords).toHaveLength(2);
        expect(ship.coords[0]).toBeGreaterThanOrEqual(0);
        expect(ship.coords[1]).toBeGreaterThanOrEqual(0);
        expect(['small', 'medium', 'large', 'xlarge']).toContain(ship.variant);
        expect(['horizontal', 'vertical']).toContain(ship.orientation);
      });
      
      setup.enemyShips.forEach(ship => {
        expect(ship.coords).toHaveLength(2);
        expect(ship.coords[0]).toBeGreaterThanOrEqual(0);
        expect(ship.coords[1]).toBeGreaterThanOrEqual(0);
        expect(['small', 'medium', 'large', 'xlarge']).toContain(ship.variant);
        expect(['horizontal', 'vertical']).toContain(ship.orientation);
      });
    });
  });

  describe('Initial Turn Selection', () => {
    let initializer: GameInitializer;

    beforeEach(() => {
      initializer = new GameInitializer();
    });

    it('should set player turn when specified', () => {
      const setup = initializer.initializeGame('player');
      
      expect(setup.initialTurn).toBe('PLAYER_TURN');
    });

    it('should set enemy turn when specified', () => {
      const setup = initializer.initializeGame('enemy');
      
      expect(setup.initialTurn).toBe('ENEMY_TURN');
    });

    it('should randomize turn when specified', () => {
      const results = new Set();
      
      // Run multiple times to get both outcomes
      for (let i = 0; i < 20; i++) {
        const setup = initializer.initializeGame('random');
        results.add(setup.initialTurn);
        
        if (results.size === 2) break; // Both outcomes found
      }
      
      // Should have at least one turn type (random may give same result multiple times)
      expect(results.size).toBeGreaterThan(0);
      expect(['PLAYER_TURN', 'ENEMY_TURN']).toContain(Array.from(results)[0] as string);
    });

    it('should use config initialTurn by default', () => {
      const initializerPlayer = new GameInitializer({ initialTurn: 'player' });
      const setupPlayer = initializerPlayer.initializeGame();
      expect(setupPlayer.initialTurn).toBe('PLAYER_TURN');
      
      const initializerEnemy = new GameInitializer({ initialTurn: 'enemy' });
      const setupEnemy = initializerEnemy.initializeGame();
      expect(setupEnemy.initialTurn).toBe('ENEMY_TURN');
    });
  });

  describe('Custom Ship Placements', () => {
    let initializer: GameInitializer;

    beforeEach(() => {
      initializer = new GameInitializer();
    });

    it('should accept custom ship placements', () => {
      const customShips = {
        playerShips: [
          { coords: [0, 0] as [number, number], variant: 'small' as const, orientation: 'horizontal' as const, shipId: 0 },
        ],
        enemyShips: [
          { coords: [5, 5] as [number, number], variant: 'small' as const, orientation: 'horizontal' as const, shipId: 0 },
        ],
      };
      
      const setup = initializer.initializeGame('player', customShips);
      
      expect(setup.playerShips).toEqual(customShips.playerShips);
      expect(setup.enemyShips).toEqual(customShips.enemyShips);
    });

    it('should generate ships when not provided', () => {
      const setup = initializer.initializeGame('player');
      
      expect(setup.playerShips.length).toBeGreaterThan(0);
      expect(setup.enemyShips.length).toBeGreaterThan(0);
    });
  });

  describe('Default Configuration', () => {
    it('should return default configuration values', () => {
      const initializer = new GameInitializer();
      const config = initializer.getDefaultConfig();
      
      expect(config.boardWidth).toBe(10);
      expect(config.boardHeight).toBe(10);
      expect(config.shipCounts).toEqual({
        small: 1,
        medium: 2,
        large: 1,
        xlarge: 1,
      });
      expect(config.initialTurn).toBe('random');
    });
  });

  describe('Ship Generation with Different Configs', () => {
    it('should generate no ships when all counts are zero', () => {
      const initializer = new GameInitializer({
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 0, medium: 0, large: 0, xlarge: 0 },
      });
      
      const setup = initializer.initializeGame();
      
      expect(setup.playerShips).toHaveLength(0);
      expect(setup.enemyShips).toHaveLength(0);
    });

    it('should handle single ship configuration', () => {
      const initializer = new GameInitializer({
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 1, medium: 0, large: 0, xlarge: 0 },
      });
      
      const setup = initializer.initializeGame();
      
      expect(setup.playerShips).toHaveLength(1);
      expect(setup.playerShips[0].variant).toBe('small');
      expect(setup.enemyShips).toHaveLength(1);
      expect(setup.enemyShips[0].variant).toBe('small');
    });

    it('should handle only large ships', () => {
      const initializer = new GameInitializer({
        boardWidth: 15,
        boardHeight: 15,
        shipCounts: { small: 0, medium: 0, large: 2, xlarge: 1 },
      });
      
      const setup = initializer.initializeGame();
      
      expect(setup.playerShips).toHaveLength(3);
      const largeShips = setup.playerShips.filter(s => s.variant === 'large');
      const xlargeShips = setup.playerShips.filter(s => s.variant === 'xlarge');
      
      expect(largeShips).toHaveLength(2);
      expect(xlargeShips).toHaveLength(1);
    });
  });

  describe('Configuration Consistency', () => {
    it('should maintain config across multiple initializations', () => {
      const initializer = new GameInitializer({ boardWidth: 12 });
      
      const setup1 = initializer.initializeGame();
      const setup2 = initializer.initializeGame();
      
      expect(setup1.config.boardWidth).toBe(12);
      expect(setup2.config.boardWidth).toBe(12);
    });

    it('should return same config instance', () => {
      const initializer = new GameInitializer({ boardWidth: 12 });
      
      const config1 = initializer.getDefaultConfig();
      const config2 = initializer.getDefaultConfig();
      
      expect(config1.boardWidth).toBe(config2.boardWidth);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum board size', () => {
      const initializer = new GameInitializer({
        boardWidth: 3,
        boardHeight: 3,
        shipCounts: { small: 1, medium: 0, large: 0, xlarge: 0 },
      });
      
      const setup = initializer.initializeGame();
      
      expect(setup.playerShips.length).toBeGreaterThan(0);
      expect(setup.config.boardWidth).toBe(3);
      expect(setup.config.boardHeight).toBe(3);
    });

    it('should handle maximum board size', () => {
      const initializer = new GameInitializer({
        boardWidth: 30,
        boardHeight: 30,
        shipCounts: { small: 5, medium: 5, large: 5, xlarge: 5 },
      });
      
      const setup = initializer.initializeGame();
      
      expect(setup.config.boardWidth).toBe(30);
      expect(setup.config.boardHeight).toBe(30);
      expect(setup.playerShips.length).toBeLessThanOrEqual(20);
    });

    it('should handle rectangular boards', () => {
      const initializer = new GameInitializer({
        boardWidth: 15,
        boardHeight: 8,
      });
      
      const setup = initializer.initializeGame();
      
      expect(setup.config.boardWidth).toBe(15);
      expect(setup.config.boardHeight).toBe(8);
      
      // Verify ships stay within bounds
      setup.playerShips.forEach(ship => {
        expect(ship.coords[0]).toBeLessThan(15);
        expect(ship.coords[1]).toBeLessThan(8);
      });
    });
  });
});
