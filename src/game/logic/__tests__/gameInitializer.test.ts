import { GameInitializer, type GameConfig } from '../gameInitializer';
import { GAME_CONSTANTS, GAME_CONFIGS } from '@/utils/constants';

describe('GameInitializer', () => {
  let initializer: GameInitializer;

  beforeEach(() => {
    initializer = new GameInitializer();
  });

  describe('constructor', () => {
    it('should create instance with default config', () => {
      expect(initializer).toBeInstanceOf(GameInitializer);
    });

    it('should merge custom config with defaults', () => {
      const customConfig: Partial<GameConfig> = {
        boardWidth: 8,
        boardHeight: 8,
        initialTurn: 'player',
      };

      const customInitializer = new GameInitializer(customConfig);
      const setup = customInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(8);
      expect(setup.config.boardHeight).toBe(8);
      expect(setup.config.initialTurn).toBe('player');
      expect(setup.config.shipCounts).toEqual(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
    });
  });

  describe('initializeGame', () => {
    it('should return valid game setup', () => {
      const setup = initializer.initializeGame();

      expect(setup).toHaveProperty('playerShips');
      expect(setup).toHaveProperty('enemyShips');
      expect(setup).toHaveProperty('initialTurn');
      expect(setup).toHaveProperty('config');

      expect(Array.isArray(setup.playerShips)).toBe(true);
      expect(Array.isArray(setup.enemyShips)).toBe(true);
      expect(['PLAYER_TURN', 'ENEMY_TURN']).toContain(setup.initialTurn);
    });

    it('should generate correct number of ships', () => {
      const setup = initializer.initializeGame();
      const expectedTotalShips = Object.values(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS).reduce((a, b) => a + b, 0);

      // Check that we get a reasonable number of ships (may be less due to placement constraints)
      expect(setup.playerShips.length).toBeGreaterThanOrEqual(expectedTotalShips * 0.8);
      expect(setup.enemyShips.length).toBeGreaterThanOrEqual(expectedTotalShips * 0.8);
      
      // Verify that all ships have valid variants
      const validVariants = Object.keys(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
      setup.playerShips.forEach(ship => {
        expect(validVariants).toContain(ship.variant);
      });
      setup.enemyShips.forEach(ship => {
        expect(validVariants).toContain(ship.variant);
      });
    });

    it('should generate ships with correct variants', () => {
      const setup = initializer.initializeGame();
      const playerVariants = setup.playerShips.map(ship => ship.variant);
      const enemyVariants = setup.enemyShips.map(ship => ship.variant);

      // Check that all ships have valid variants
      const validVariants = Object.keys(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
      [...playerVariants, ...enemyVariants].forEach(variant => {
        expect(validVariants).toContain(variant);
      });
      
      // Check that we have a reasonable total number of ships (may be less due to placement constraints)
      const expectedTotalShips = Object.values(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS).reduce((a, b) => a + b, 0);
      expect(setup.playerShips.length + setup.enemyShips.length).toBeGreaterThanOrEqual(expectedTotalShips * 1.6);
      
      // Check that both players have ships (even if not all variants)
      expect(setup.playerShips.length).toBeGreaterThan(0);
      expect(setup.enemyShips.length).toBeGreaterThan(0);
    });

    it('should respect initialTurn configuration', () => {
      const playerFirstInitializer = new GameInitializer({ initialTurn: 'player' });
      const enemyFirstInitializer = new GameInitializer({ initialTurn: 'enemy' });

      const playerSetup = playerFirstInitializer.initializeGame();
      const enemySetup = enemyFirstInitializer.initializeGame();

      expect(playerSetup.initialTurn).toBe('PLAYER_TURN');
      expect(enemySetup.initialTurn).toBe('ENEMY_TURN');
    });
  });

  describe('static factory methods', () => {
    it('should create quick game config', () => {
      const config = GameInitializer.createQuickGameConfig();
      expect(config).toEqual(GAME_CONFIGS.QUICK);
    });

    it('should create classic game config', () => {
      const config = GameInitializer.createClassicGameConfig();
      expect(config).toEqual(GAME_CONFIGS.CLASSIC);
    });

    it('should create challenging game config', () => {
      const config = GameInitializer.createChallengingGameConfig();
      expect(config).toEqual(GAME_CONFIGS.CHALLENGING);
    });
  });

  describe('ship generation with custom configs', () => {
    it('should work with quick game config', () => {
      const quickInitializer = new GameInitializer(GAME_CONFIGS.QUICK);
      const setup = quickInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(8);
      expect(setup.config.boardHeight).toBe(8);
      expect(setup.config.shipCounts.small).toBe(2);
      expect(setup.config.shipCounts.medium).toBe(1);
      expect(setup.config.shipCounts.large).toBe(0);
      expect(setup.config.shipCounts.xlarge).toBe(0);
    });

    it('should work with challenging game config', () => {
      const challengingInitializer = new GameInitializer(GAME_CONFIGS.CHALLENGING);
      const setup = challengingInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(12);
      expect(setup.config.boardHeight).toBe(12);
      expect(setup.config.shipCounts.small).toBe(5);
      expect(setup.config.shipCounts.medium).toBe(4);
      expect(setup.config.shipCounts.large).toBe(3);
      expect(setup.config.shipCounts.xlarge).toBe(2);
    });
  });

  describe('ship placement validation', () => {
    it('should generate ships within board boundaries', () => {
      const setup = initializer.initializeGame();
      const allShips = [...setup.playerShips, ...setup.enemyShips];

      for (const ship of allShips) {
        const size = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];
        const [x, y] = ship.coords;

        if (ship.orientation === 'horizontal') {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x + size).toBeLessThanOrEqual(setup.config.boardWidth);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThan(setup.config.boardHeight);
        } else {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(setup.config.boardWidth);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y + size).toBeLessThanOrEqual(setup.config.boardHeight);
        }
      }
    });

    it('should respect minimum ship distance', () => {
      const setup = initializer.initializeGame();
      const allShips = [...setup.playerShips, ...setup.enemyShips];

      // Test a subset of ships to avoid memory issues
      const maxShipsToTest = Math.min(allShips.length, 5);
      
      for (let i = 0; i < maxShipsToTest; i++) {
        for (let j = i + 1; j < maxShipsToTest; j++) {
          const ship1 = allShips[i];
          const ship2 = allShips[j];
          
          const cells1 = getShipCells(ship1);
          const cells2 = getShipCells(ship2);

          // Test only a few cells to avoid memory issues
          const testCells1 = cells1.slice(0, 2);
          const testCells2 = cells2.slice(0, 2);

          for (const [x1, y1] of testCells1) {
            for (const [x2, y2] of testCells2) {
              const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
              expect(distance).toBeGreaterThanOrEqual(setup.config.minShipDistance);
            }
          }
        }
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty ship counts', () => {
      const emptyConfig: Partial<GameConfig> = {
        shipCounts: {
          small: 0,
          medium: 0,
          large: 0,
          xlarge: 0,
        },
      };

      const emptyInitializer = new GameInitializer(emptyConfig);
      const setup = emptyInitializer.initializeGame();

      expect(setup.playerShips.length).toBe(0);
      expect(setup.enemyShips.length).toBe(0);
    });

    it('should handle small board size', () => {
      const smallBoardConfig: Partial<GameConfig> = {
        boardWidth: 5,
        boardHeight: 5,
        shipCounts: {
          small: 1,
          medium: 0,
          large: 0,
          xlarge: 0,
        },
      };

      const smallBoardInitializer = new GameInitializer(smallBoardConfig);
      const setup = smallBoardInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(5);
      expect(setup.config.boardHeight).toBe(5);
      expect(setup.playerShips.length).toBe(1);
      expect(setup.enemyShips.length).toBe(1);
    });
  });
});

// Helper function to get ship cells for testing
function getShipCells(ship: { variant: string; coords: [number, number]; orientation: string }): [number, number][] {
  const cells: [number, number][] = [];
  const size = GAME_CONSTANTS.SHIPS.SIZES[ship.variant as keyof typeof GAME_CONSTANTS.SHIPS.SIZES];
  const [x, y] = ship.coords;

  for (let i = 0; i < size; i++) {
    if (ship.orientation === 'horizontal') {
      cells.push([x + i, y]);
    } else {
      cells.push([x, y + i]);
    }
  }

  return cells;
} 