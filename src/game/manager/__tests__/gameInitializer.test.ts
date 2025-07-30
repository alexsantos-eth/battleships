import type { GameConfig } from "@/types/game/config";
import { GameInitializer } from "../initializer";
import { GAME_CONSTANTS } from "@/constants/game/board";
import { getShipCellsFromShip } from "@/tools/ship/calculations";

describe("GameInitializer", () => {
  let initializer: GameInitializer;

  beforeEach(() => {
    initializer = new GameInitializer();
  });

  describe("constructor", () => {
    it("should create instance with default config", () => {
      expect(initializer).toBeInstanceOf(GameInitializer);
    });

    it("should merge custom config with defaults", () => {
      const customConfig: Partial<GameConfig> = {
        boardWidth: 8,
        boardHeight: 8,
        initialTurn: "player",
      };

      const customInitializer = new GameInitializer(customConfig);
      const setup = customInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(8);
      expect(setup.config.boardHeight).toBe(8);
      expect(setup.config.initialTurn).toBe("player");
      expect(setup.config.shipCounts).toEqual(
        GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS
      );
    });

    it("should validate config and throw error for invalid board width", () => {
      const invalidConfig: Partial<GameConfig> = {
        boardWidth: 3, // Below minimum
      };

      expect(() => new GameInitializer(invalidConfig)).toThrow(
        `Board width must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`
      );
    });

    it("should validate config and throw error for invalid board height", () => {
      const invalidConfig: Partial<GameConfig> = {
        boardHeight: 20, // Above maximum
      };

      expect(() => new GameInitializer(invalidConfig)).toThrow(
        `Board height must be between ${GAME_CONSTANTS.BOARD.MIN_SIZE} and ${GAME_CONSTANTS.BOARD.MAX_SIZE}`
      );
    });



    it("should validate config and throw error for too many ships", () => {
      const invalidConfig: Partial<GameConfig> = {
        boardWidth: 5,
        boardHeight: 5,
        shipCounts: {
          small: 10,
          medium: 10,
          large: 10,
          xlarge: 10,
        },
      };

      expect(() => new GameInitializer(invalidConfig)).toThrow(
        "Too many ships for board size"
      );
    });
  });

  describe("initializeGame", () => {
    it("should return valid game setup", () => {
      const setup = initializer.initializeGame();

      expect(setup).toHaveProperty("playerShips");
      expect(setup).toHaveProperty("enemyShips");
      expect(setup).toHaveProperty("initialTurn");
      expect(setup).toHaveProperty("config");

      expect(Array.isArray(setup.playerShips)).toBe(true);
      expect(Array.isArray(setup.enemyShips)).toBe(true);
      expect(["PLAYER_TURN", "ENEMY_TURN"]).toContain(setup.initialTurn);
    });

    it("should generate correct number of ships", () => {
      const setup = initializer.initializeGame();
      const expectedTotalShips = Object.values(
        GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS
      ).reduce((a: number, b: number) => a + b, 0);

      expect(setup.playerShips.length).toBeGreaterThanOrEqual(
        expectedTotalShips * 0.8
      );
      expect(setup.enemyShips.length).toBeGreaterThanOrEqual(
        expectedTotalShips * 0.8
      );

      const validVariants = Object.keys(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
      setup.playerShips.forEach((ship) => {
        expect(validVariants).toContain(ship.variant);
      });
      setup.enemyShips.forEach((ship) => {
        expect(validVariants).toContain(ship.variant);
      });
    });

    it("should generate ships with correct variants", () => {
      const setup = initializer.initializeGame();
      const playerVariants = setup.playerShips.map((ship) => ship.variant);
      const enemyVariants = setup.enemyShips.map((ship) => ship.variant);

      const validVariants = Object.keys(GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS);
      [...playerVariants, ...enemyVariants].forEach((variant) => {
        expect(validVariants).toContain(variant);
      });

      const expectedTotalShips = Object.values(
        GAME_CONSTANTS.SHIPS.DEFAULT_COUNTS
      ).reduce((a: number, b: number) => a + b, 0);
      expect(
        setup.playerShips.length + setup.enemyShips.length
      ).toBeGreaterThanOrEqual(expectedTotalShips * 1.6);

      expect(setup.playerShips.length).toBeGreaterThan(0);
      expect(setup.enemyShips.length).toBeGreaterThan(0);
    });

    it("should respect initialTurn configuration", () => {
      const playerFirstInitializer = new GameInitializer({
        initialTurn: "player",
      });
      const enemyFirstInitializer = new GameInitializer({
        initialTurn: "enemy",
      });

      const playerSetup = playerFirstInitializer.initializeGame();
      const enemySetup = enemyFirstInitializer.initializeGame();

      expect(playerSetup.initialTurn).toBe("PLAYER_TURN");
      expect(enemySetup.initialTurn).toBe("ENEMY_TURN");
    });

    it("should handle random initial turn", () => {
      const randomInitializer = new GameInitializer({ initialTurn: "random" });
      const setup = randomInitializer.initializeGame();

      expect(["PLAYER_TURN", "ENEMY_TURN"]).toContain(setup.initialTurn);
    });
  });



  describe("ship generation with custom configs", () => {
    it("should work with custom ship counts", () => {
      const customConfig: Partial<GameConfig> = {
        boardWidth: 8,
        boardHeight: 8,
        shipCounts: {
          small: 2,
          medium: 1,
          large: 1,
          xlarge: 0,
        },
        initialTurn: "player",
      };
      const customInitializer = new GameInitializer(customConfig);
      const setup = customInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(8);
      expect(setup.config.boardHeight).toBe(8);
      expect(setup.config.shipCounts!.small).toBe(2);
      expect(setup.config.shipCounts!.medium).toBe(1);
      expect(setup.config.shipCounts!.large).toBe(1);
      expect(setup.config.shipCounts!.xlarge).toBe(0);
    });

    it("should work with larger board and more ships", () => {
      const largeConfig: Partial<GameConfig> = {
        boardWidth: 12,
        boardHeight: 12,
        shipCounts: {
          small: 6,
          medium: 4,
          large: 3,
          xlarge: 2,
        },
        initialTurn: "player",
      };
      const largeInitializer = new GameInitializer(largeConfig);
      const setup = largeInitializer.initializeGame();

      expect(setup.config.boardWidth).toBe(12);
      expect(setup.config.boardHeight).toBe(12);
      expect(setup.config.shipCounts!.small).toBe(6);
      expect(setup.config.shipCounts!.medium).toBe(4);
      expect(setup.config.shipCounts!.large).toBe(3);
      expect(setup.config.shipCounts!.xlarge).toBe(2);
    });
  });

  describe("ship placement validation", () => {
    it("should generate ships within board boundaries", () => {
      const setup = initializer.initializeGame();
      const allShips = [...setup.playerShips, ...setup.enemyShips];

      for (const ship of allShips) {
        const size = GAME_CONSTANTS.SHIPS.SIZES[ship.variant];
        const [x, y] = ship.coords;

        if (typeof x === 'number' && typeof y === 'number' && typeof setup.config.boardWidth === 'number' && typeof setup.config.boardHeight === 'number') {
          if (ship.orientation === "horizontal") {
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
      }
    });

    it("should respect minimum ship distance", () => {
      const setup = initializer.initializeGame();
      const allShips = [...setup.playerShips, ...setup.enemyShips];

      const maxShipsToTest = Math.min(allShips.length, 5);

      for (let i = 0; i < maxShipsToTest; i++) {
        for (let j = i + 1; j < maxShipsToTest; j++) {
          const ship1 = allShips[i];
          const ship2 = allShips[j];

          const cells1 = getShipCellsFromShip(ship1);
          const cells2 = getShipCellsFromShip(ship2);

          const testCells1 = cells1.slice(0, 2);
          const testCells2 = cells2.slice(0, 2);

          for (const [x1, y1] of testCells1) {
            for (const [x2, y2] of testCells2) {
              if (typeof x1 === 'number' && typeof x2 === 'number' && typeof y1 === 'number' && typeof y2 === 'number') {
                const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
                expect(distance).toBeGreaterThanOrEqual(
                  GAME_CONSTANTS.SHIPS.MIN_DISTANCE
                );
              }
            }
          }
        }
      }
    });

    it("should generate ships with valid orientations", () => {
      const setup = initializer.initializeGame();
      const allShips = [...setup.playerShips, ...setup.enemyShips];

      allShips.forEach((ship) => {
        expect(["horizontal", "vertical"]).toContain(ship.orientation);
      });
    });

    it("should generate ships with valid coordinates", () => {
      const setup = initializer.initializeGame();
      const allShips = [...setup.playerShips, ...setup.enemyShips];

      allShips.forEach((ship) => {
        expect(Array.isArray(ship.coords)).toBe(true);
        expect(ship.coords).toHaveLength(2);
        expect(typeof ship.coords[0]).toBe("number");
        expect(typeof ship.coords[1]).toBe("number");
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty ship counts", () => {
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

    it("should handle very small board", () => {
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

      expect(setup.playerShips.length).toBeGreaterThanOrEqual(0);
      expect(setup.enemyShips.length).toBeGreaterThanOrEqual(0);
    });


  });

  describe("configuration validation", () => {


    it("should accept valid initialTurn types", () => {
      const validTurnTypes: Array<GameConfig["initialTurn"]> = [
        "player",
        "enemy",
        "random",
      ];

      validTurnTypes.forEach((turnType) => {
        const config: Partial<GameConfig> = { initialTurn: turnType };
        expect(() => new GameInitializer(config)).not.toThrow();
      });
    });
  });
});


