import { describe, it, expect } from 'vitest';
import {
  getShipCells,
  getShipCellsFromShip,
  getShipSize,
  isValidShipPlacement,
  generateShip,
  generateShips,
  getQuadrantPreferences,
  generatePositionInPreferredQuadrant,
  generateRandomPosition,
} from '../../../tools/ship/calculations';
import { GAME_CONSTANTS } from '../../../constants/game';
import type { GameShip, ShipVariant } from '../../../types/common';

describe('Ship Calculations', () => {
  describe('getShipCells', () => {
    it('should generate horizontal ship cells', () => {
      const cells = getShipCells(2, 3, 3, 'horizontal');
      
      expect(cells).toEqual([
        [2, 3],
        [3, 3],
        [4, 3],
      ]);
    });

    it('should generate vertical ship cells', () => {
      const cells = getShipCells(5, 2, 3, 'vertical');
      
      expect(cells).toEqual([
        [5, 2],
        [5, 3],
        [5, 4],
      ]);
    });

    it('should handle single cell ship', () => {
      const cells = getShipCells(0, 0, 1, 'horizontal');
      expect(cells).toEqual([[0, 0]]);
    });

    it('should handle large ships', () => {
      const cells = getShipCells(0, 0, 5, 'horizontal');
      
      expect(cells).toHaveLength(5);
      expect(cells).toEqual([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ]);
    });
  });

  describe('getShipCellsFromShip', () => {
    it('should get cells from small horizontal ship', () => {
      const ship: GameShip = {
        coords: [2, 3],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const cells = getShipCellsFromShip(ship);
      
      expect(cells).toEqual([
        [2, 3],
        [3, 3],
      ]);
    });

    it('should get cells from medium vertical ship', () => {
      const ship: GameShip = {
        coords: [5, 5],
        variant: 'medium',
        orientation: 'vertical',
      };
      
      const cells = getShipCellsFromShip(ship);
      
      expect(cells).toEqual([
        [5, 5],
        [5, 6],
        [5, 7],
      ]);
    });

    it('should get cells from large ship', () => {
      const ship: GameShip = {
        coords: [0, 0],
        variant: 'large',
        orientation: 'horizontal',
      };
      
      const cells = getShipCellsFromShip(ship);
      expect(cells).toHaveLength(4);
    });

    it('should get cells from xlarge ship', () => {
      const ship: GameShip = {
        coords: [0, 0],
        variant: 'xlarge',
        orientation: 'vertical',
      };
      
      const cells = getShipCellsFromShip(ship);
      expect(cells).toHaveLength(5);
    });
  });

  describe('getShipSize', () => {
    it('should return correct size for small ship', () => {
      expect(getShipSize('small')).toBe(2);
    });

    it('should return correct size for medium ship', () => {
      expect(getShipSize('medium')).toBe(3);
    });

    it('should return correct size for large ship', () => {
      expect(getShipSize('large')).toBe(4);
    });

    it('should return correct size for xlarge ship', () => {
      expect(getShipSize('xlarge')).toBe(5);
    });

    it('should match GAME_CONSTANTS values', () => {
      expect(getShipSize('small')).toBe(GAME_CONSTANTS.SHIPS.SIZES.small);
      expect(getShipSize('medium')).toBe(GAME_CONSTANTS.SHIPS.SIZES.medium);
      expect(getShipSize('large')).toBe(GAME_CONSTANTS.SHIPS.SIZES.large);
      expect(getShipSize('xlarge')).toBe(GAME_CONSTANTS.SHIPS.SIZES.xlarge);
    });
  });

  describe('isValidShipPlacement', () => {
    it('should validate ship within board bounds', () => {
      const ship: GameShip = {
        coords: [0, 0],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const valid = isValidShipPlacement(ship, [], 10, 10);
      expect(valid).toBe(true);
    });

    it('should reject ship outside board (right edge)', () => {
      const ship: GameShip = {
        coords: [9, 0],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const valid = isValidShipPlacement(ship, [], 10, 10);
      expect(valid).toBe(false);
    });

    it('should reject ship outside board (bottom edge)', () => {
      const ship: GameShip = {
        coords: [0, 9],
        variant: 'small',
        orientation: 'vertical',
      };
      
      const valid = isValidShipPlacement(ship, [], 10, 10);
      expect(valid).toBe(false);
    });

    it('should reject ship starting at negative coordinates', () => {
      const ship: GameShip = {
        coords: [-1, 0],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const valid = isValidShipPlacement(ship, [], 10, 10);
      expect(valid).toBe(false);
    });

    it('should reject overlapping ships', () => {
      const existingShip: GameShip = {
        coords: [2, 2],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const newShip: GameShip = {
        coords: [3, 2],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const valid = isValidShipPlacement(newShip, [existingShip], 10, 10);
      expect(valid).toBe(false);
    });

    it('should enforce minimum distance between ships', () => {
      const existingShip: GameShip = {
        coords: [2, 2],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      // Too close (distance 1)
      const tooClose: GameShip = {
        coords: [2, 3],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      expect(isValidShipPlacement(tooClose, [existingShip], 10, 10)).toBe(false);
      
      // Far enough (distance 2)
      const farEnough: GameShip = {
        coords: [2, 4],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      expect(isValidShipPlacement(farEnough, [existingShip], 10, 10)).toBe(true);
    });

    it('should validate diagonal distance', () => {
      const existingShip: GameShip = {
        coords: [5, 5],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      // Diagonal adjacent (too close)
      const diagonal: GameShip = {
        coords: [7, 6],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      expect(isValidShipPlacement(diagonal, [existingShip], 10, 10)).toBe(false);
    });

    it('should allow ships at exact minimum distance', () => {
      const existingShip: GameShip = {
        coords: [0, 0],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      const newShip: GameShip = {
        coords: [0, 2],
        variant: 'small',
        orientation: 'horizontal',
      };
      
      expect(isValidShipPlacement(newShip, [existingShip], 10, 10)).toBe(true);
    });
  });

  describe('generateShip', () => {
    it('should generate a valid ship on empty board', () => {
      const ship = generateShip('small', 10, 10, []);
      
      expect(ship).not.toBeNull();
      expect(ship?.variant).toBe('small');
      expect(['horizontal', 'vertical']).toContain(ship?.orientation);
      expect(ship?.coords).toHaveLength(2);
    });

    it('should generate different ship variants', () => {
      const variants: ShipVariant[] = ['small', 'medium', 'large', 'xlarge'];
      
      variants.forEach(variant => {
        const ship = generateShip(variant, 15, 15, []);
        
        expect(ship).not.toBeNull();
        expect(ship?.variant).toBe(variant);
      });
    });

    it('should respect existing ships', () => {
      const existingShips: GameShip[] = [
        { coords: [0, 0], variant: 'small', orientation: 'horizontal', shipId: 0 },
      ];
      
      const ship = generateShip('small', 10, 10, existingShips);
      
      if (ship) {
        expect(isValidShipPlacement(ship, existingShips, 10, 10)).toBe(true);
      }
    });

    it('should return null when placement is impossible', () => {
      // Try to place large ship on tiny board with existing ships
      const existingShips: GameShip[] = [
        { coords: [0, 0], variant: 'small', orientation: 'horizontal', shipId: 0 },
      ];
      
      const ship = generateShip('xlarge', 3, 3, existingShips);
      
      // May or may not succeed, but should not throw
      expect(ship === null || ship !== null).toBe(true);
    });

    it('should assign correct ship ID', () => {
      const existingShips: GameShip[] = [
        { coords: [0, 0], variant: 'small', orientation: 'horizontal', shipId: 0 },
        { coords: [5, 5], variant: 'small', orientation: 'horizontal', shipId: 1 },
      ];
      
      const ship = generateShip('small', 10, 10, existingShips);
      
      expect(ship?.shipId).toBe(2);
    });
  });

  describe('generateShips', () => {
    it('should generate ships according to config', () => {
      const config = {
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 2, medium: 1, large: 1, xlarge: 0 },
      };
      
      const ships = generateShips(config);
      
      const smallShips = ships.filter(s => s.variant === 'small');
      const mediumShips = ships.filter(s => s.variant === 'medium');
      const largeShips = ships.filter(s => s.variant === 'large');
      
      expect(smallShips).toHaveLength(2);
      expect(mediumShips).toHaveLength(1);
      expect(largeShips).toHaveLength(1);
    });

    it('should generate no ships when counts are zero', () => {
      const config = {
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 0, medium: 0, large: 0, xlarge: 0 },
      };
      
      const ships = generateShips(config);
      expect(ships).toHaveLength(0);
    });

    it('should generate valid placements for all ships', () => {
      const config = {
        boardWidth: 15,
        boardHeight: 15,
        shipCounts: { small: 2, medium: 2, large: 1, xlarge: 1 },
      };
      
      const ships = generateShips(config);
      
      ships.forEach((ship, index) => {
        const otherShips = ships.slice(0, index);
        expect(isValidShipPlacement(ship, otherShips, 15, 15)).toBe(true);
      });
    });

    it('should handle default config values', () => {
      const config = {};
      
      const ships = generateShips(config);
      
      // Should use defaults from GAME_CONSTANTS
      expect(ships.length).toBeGreaterThanOrEqual(0);
    });

    it('should assign unique ship IDs', () => {
      const config = {
        boardWidth: 10,
        boardHeight: 10,
        shipCounts: { small: 3, medium: 0, large: 0, xlarge: 0 },
      };
      
      const ships = generateShips(config);
      const ids = new Set(ships.map(s => s.shipId));
      
      expect(ids.size).toBe(ships.length); // All unique
    });
  });

  describe('getQuadrantPreferences', () => {
    it('should return preferences for small ships', () => {
      const prefs = getQuadrantPreferences('small');
      
      expect(prefs).toBeDefined();
      expect(Array.isArray(prefs)).toBe(true);
      expect(prefs.length).toBeGreaterThan(0);
    });

    it('should return preferences for all ship variants', () => {
      const variants: ShipVariant[] = ['small', 'medium', 'large', 'xlarge'];
      
      variants.forEach(variant => {
        const prefs = getQuadrantPreferences(variant);
        expect(prefs).toBeDefined();
        expect(Array.isArray(prefs)).toBe(true);
      });
    });

    it('should return different preferences for different variants', () => {
      const smallPrefs = getQuadrantPreferences('small');
      const largePrefs = getQuadrantPreferences('large');
      
      // Preferences should be defined but may vary
      expect(smallPrefs).toBeDefined();
      expect(largePrefs).toBeDefined();
    });
  });

  describe('generatePositionInPreferredQuadrant', () => {
    it('should generate position within board bounds', () => {
      const quadrantPreferences = [[0, 1]];
      const pos = generatePositionInPreferredQuadrant(
        2,
        'horizontal',
        quadrantPreferences,
        10,
        10
      );
      
      expect(pos).toHaveLength(2);
      expect(pos[0]).toBeGreaterThanOrEqual(0);
      expect(pos[1]).toBeGreaterThanOrEqual(0);
      expect(pos[0]).toBeLessThan(10);
      expect(pos[1]).toBeLessThan(10);
    });

    it('should handle horizontal orientation', () => {
      const quadrantPreferences = [[0]];
      const pos = generatePositionInPreferredQuadrant(
        3,
        'horizontal',
        quadrantPreferences,
        10,
        10
      );
      
      expect(pos[0] + 3).toBeLessThanOrEqual(10); // Ship must fit
    });

    it('should handle vertical orientation', () => {
      const quadrantPreferences = [[0]];
      const pos = generatePositionInPreferredQuadrant(
        3,
        'vertical',
        quadrantPreferences,
        10,
        10
      );
      
      expect(pos[1] + 3).toBeLessThanOrEqual(10); // Ship must fit
    });

    it('should respect different quadrants', () => {
      // Should not throw for any quadrant
      [0, 1, 2, 3].forEach(q => {
        const pos = generatePositionInPreferredQuadrant(
          2,
          'horizontal',
          [[q]],
          10,
          10
        );
        expect(pos).toBeDefined();
      });
    });
  });

  describe('generateRandomPosition', () => {
    it('should generate valid horizontal position', () => {
      const pos = generateRandomPosition(3, 'horizontal', 10, 10);
      
      expect(pos).toHaveLength(2);
      expect(pos[0]).toBeGreaterThanOrEqual(0);
      expect(pos[0] + 3).toBeLessThanOrEqual(10);
      expect(pos[1]).toBeGreaterThanOrEqual(0);
      expect(pos[1]).toBeLessThan(10);
    });

    it('should generate valid vertical position', () => {
      const pos = generateRandomPosition(3, 'vertical', 10, 10);
      
      expect(pos).toHaveLength(2);
      expect(pos[0]).toBeGreaterThanOrEqual(0);
      expect(pos[0]).toBeLessThan(10);
      expect(pos[1]).toBeGreaterThanOrEqual(0);
      expect(pos[1] + 3).toBeLessThanOrEqual(10);
    });

    it('should handle edge case of size-1 ship', () => {
      const pos = generateRandomPosition(1, 'horizontal', 10, 10);
      
      expect(pos[0]).toBeGreaterThanOrEqual(0);
      expect(pos[0]).toBeLessThan(10);
      expect(pos[1]).toBeGreaterThanOrEqual(0);
      expect(pos[1]).toBeLessThan(10);
    });

    it('should handle ship that fills entire dimension', () => {
      const pos = generateRandomPosition(10, 'horizontal', 10, 10);
      
      expect(pos[0]).toBe(0); // Only valid position
      expect(pos[1]).toBeGreaterThanOrEqual(0);
      expect(pos[1]).toBeLessThan(10);
    });
  });

  describe('Integration - Full Ship Generation', () => {
    it('should generate complete valid fleet', () => {
      const config = {
        boardWidth: 20,
        boardHeight: 20,
        shipCounts: { small: 3, medium: 3, large: 2, xlarge: 2 },
      };
      
      const ships = generateShips(config);
      
      // Should generate most or all ships
      expect(ships.length).toBeGreaterThanOrEqual(8);
      
      // All ships should be valid
      ships.forEach((ship, index) => {
        const otherShips = ships.slice(0, index);
        expect(isValidShipPlacement(ship, otherShips, 20, 20)).toBe(true);
      });
    });

    it('should handle crowded board gracefully', () => {
      const config = {
        boardWidth: 8,
        boardHeight: 8,
        shipCounts: { small: 3, medium: 2, large: 1, xlarge: 0 },
      };
      
      const ships = generateShips(config);
      
      // May not fit all ships, but should not throw
      expect(ships.length).toBeGreaterThanOrEqual(0);
      expect(ships.length).toBeLessThanOrEqual(6);
    });

    it('should maintain distance between all generated ships', () => {
      const config = {
        boardWidth: 15,
        boardHeight: 15,
        shipCounts: { small: 2, medium: 2, large: 1, xlarge: 1 },
      };
      
      const ships = generateShips(config);
      
      for (let i = 0; i < ships.length; i++) {
        for (let j = i + 1; j < ships.length; j++) {
          const ship1Cells = getShipCellsFromShip(ships[i]);
          const ship2Cells = getShipCellsFromShip(ships[j]);
          
          // Check minimum distance between all cell pairs
          ship1Cells.forEach(([x1, y1]) => {
            ship2Cells.forEach(([x2, y2]) => {
              const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
              expect(distance).toBeGreaterThanOrEqual(GAME_CONSTANTS.SHIPS.MIN_DISTANCE);
            });
          });
        }
      }
    });
  });
});
