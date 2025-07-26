import { ShipGenerator } from '../shipGenerator';
import type { ShipPlacement } from '../shipGenerator';
import type { ShipOrientation, Position } from '../battleship';

// Mock Math.random for consistent testing
const originalRandom = Math.random;
const mockRandom = jest.fn();

beforeEach(() => {
  Math.random = mockRandom;
});

afterEach(() => {
  Math.random = originalRandom;
  jest.clearAllMocks();
});

describe('ShipGenerator', () => {
  describe('Initialization', () => {
    it('should initialize with default board size', () => {
      const generator = new ShipGenerator();
      expect(generator.getTotalShipCount()).toBe(10); // 4+3+2+1
    });

    it('should initialize with custom board size', () => {
      const generator = new ShipGenerator(15, 20);
      expect(generator.getTotalShipCount()).toBe(10);
    });

    it('should have correct ship counts', () => {
      const generator = new ShipGenerator();
      const counts = generator.getShipCounts();
      
      expect(counts.small).toBe(4);
      expect(counts.medium).toBe(3);
      expect(counts.large).toBe(2);
      expect(counts.xlarge).toBe(1);
    });

    it('should return immutable ship counts', () => {
      const generator = new ShipGenerator();
      const counts = generator.getShipCounts();
      
      // Modify the returned object
      counts.small = 999;
      
      // Original should remain unchanged
      const newCounts = generator.getShipCounts();
      expect(newCounts.small).toBe(4);
    });
  });

  describe('Ship Generation', () => {
    it('should generate ships successfully with real random', () => {
      // Use real Math.random for this test
      Math.random = originalRandom;
      const generator = new ShipGenerator();
      
      const ships = generator.generateRandomShips();
      
      expect(ships).toHaveLength(10);
      expect(ships.every(ship => ['horizontal', 'vertical'].includes(ship.orientation))).toBe(true);
    });

    it('should generate ships with correct variants', () => {
      // Use real Math.random for this test
      Math.random = originalRandom;
      const generator = new ShipGenerator();
      
      const ships = generator.generateRandomShips();
      const variants = ships.map(ship => ship.variant);
      
      expect(variants.filter(v => v === 'small')).toHaveLength(4);
      expect(variants.filter(v => v === 'medium')).toHaveLength(3);
      expect(variants.filter(v => v === 'large')).toHaveLength(2);
      expect(variants.filter(v => v === 'xlarge')).toHaveLength(1);
    });

    it('should generate ships within board boundaries', () => {
      // Use real Math.random for this test
      Math.random = originalRandom;
      const generator = new ShipGenerator();
      
      const ships = generator.generateRandomShips();
      
      ships.forEach(ship => {
        const size = ship.variant === 'small' ? 2 : 
                    ship.variant === 'medium' ? 3 :
                    ship.variant === 'large' ? 4 : 5;
        
        if (ship.orientation === 'horizontal') {
          expect(ship.position.x + size - 1).toBeLessThan(10);
          expect(ship.position.y).toBeLessThan(10);
        } else {
          expect(ship.position.x).toBeLessThan(10);
          expect(ship.position.y + size - 1).toBeLessThan(10);
        }
      });
    });

    it('should generate non-overlapping ships', () => {
      // Use real Math.random for this test
      Math.random = originalRandom;
      const generator = new ShipGenerator();
      
      const ships = generator.generateRandomShips();
      
      // Check for overlaps
      for (let i = 0; i < ships.length; i++) {
        for (let j = i + 1; j < ships.length; j++) {
          const ship1 = ships[i];
          const ship2 = ships[j];
          
          const size1 = ship1.variant === 'small' ? 2 : 
                       ship1.variant === 'medium' ? 3 :
                       ship1.variant === 'large' ? 4 : 5;
          const size2 = ship2.variant === 'small' ? 2 : 
                       ship2.variant === 'medium' ? 3 :
                       ship2.variant === 'large' ? 4 : 5;
          
          // Check if ships overlap
          const overlap = checkShipOverlap(ship1, size1, ship2, size2);
          expect(overlap).toBe(false);
        }
      }
    });
  });

  describe('Ship Placement Validation', () => {
    let generator: ShipGenerator;

    beforeEach(() => {
      generator = new ShipGenerator();
    });

    it('should validate valid ship placement', () => {
      const placement: ShipPlacement = {
        position: { x: 0, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      };
      
      const isValid = generator.validateShipPlacement(placement, []);
      expect(isValid).toBe(true);
    });

    it('should reject ship placement outside boundaries', () => {
      const placement: ShipPlacement = {
        position: { x: 9, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      };
      
      const isValid = generator.validateShipPlacement(placement, []);
      expect(isValid).toBe(false);
    });

    it('should reject overlapping ship placements', () => {
      const existingShip: ShipPlacement = {
        position: { x: 0, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      };
      
      const newShip: ShipPlacement = {
        position: { x: 0, y: 0 },
        variant: 'medium',
        orientation: 'horizontal'
      };
      
      const isValid = generator.validateShipPlacement(newShip, [existingShip]);
      expect(isValid).toBe(false);
    });

    it('should accept adjacent ship placements', () => {
      const existingShip: ShipPlacement = {
        position: { x: 0, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      };
      
      const newShip: ShipPlacement = {
        position: { x: 2, y: 0 },
        variant: 'medium',
        orientation: 'horizontal'
      };
      
      const isValid = generator.validateShipPlacement(newShip, [existingShip]);
      expect(isValid).toBe(true);
    });

    it('should handle vertical ship placement', () => {
      const placement: ShipPlacement = {
        position: { x: 0, y: 0 },
        variant: 'large',
        orientation: 'vertical'
      };
      
      const isValid = generator.validateShipPlacement(placement, []);
      expect(isValid).toBe(true);
    });

    it('should reject vertical ship placement outside boundaries', () => {
      const placement: ShipPlacement = {
        position: { x: 0, y: 7 },
        variant: 'large',
        orientation: 'vertical'
      };
      
      const isValid = generator.validateShipPlacement(placement, []);
      expect(isValid).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum attempts gracefully', () => {
      // Mock to always return the same position to trigger max attempts
      mockRandom.mockReturnValue(0.5);
      const generator = new ShipGenerator(5, 5); // Small board
      
      expect(() => {
        generator.generateRandomShips();
      }).toThrow('Could not place ship');
    });

    it('should handle very small board', () => {
      mockRandom.mockReturnValue(0.5);
      const generator = new ShipGenerator(3, 3);
      
      expect(() => {
        generator.generateRandomShips();
      }).toThrow('Could not place ship');
    });

    it('should handle large board', () => {
      // Use real Math.random for this test
      Math.random = originalRandom;
      const generator = new ShipGenerator(20, 20);
      
      const ships = generator.generateRandomShips();
      expect(ships).toHaveLength(10);
    });
  });

  describe('Ship Size Mapping', () => {
    it('should have correct ship sizes', () => {
      const generator = new ShipGenerator();
      
      // Test through placement validation
      const smallShip: ShipPlacement = {
        position: { x: 8, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      };
      expect(generator.validateShipPlacement(smallShip, [])).toBe(true);
      
      const largeShip: ShipPlacement = {
        position: { x: 6, y: 0 },
        variant: 'large',
        orientation: 'horizontal'
      };
      expect(generator.validateShipPlacement(largeShip, [])).toBe(true);
      
      // This should be invalid (too close to edge)
      const invalidLargeShip: ShipPlacement = {
        position: { x: 7, y: 0 },
        variant: 'large',
        orientation: 'horizontal'
      };
      expect(generator.validateShipPlacement(invalidLargeShip, [])).toBe(false);
    });
  });
});

// Helper function to check ship overlap
function checkShipOverlap(
  ship1: ShipPlacement, 
  size1: number, 
  ship2: ShipPlacement, 
  size2: number
): boolean {
  const cells1 = getShipCells(ship1.position, size1, ship1.orientation);
  const cells2 = getShipCells(ship2.position, size2, ship2.orientation);
  
  for (const cell1 of cells1) {
    for (const cell2 of cells2) {
      if (cell1.x === cell2.x && cell1.y === cell2.y) {
        return true;
      }
    }
  }
  return false;
}

// Helper function to get ship cells
function getShipCells(position: Position, size: number, orientation: ShipOrientation): Position[] {
  const cells: Position[] = [];
  
  if (orientation === 'horizontal') {
    for (let i = 0; i < size; i++) {
      cells.push({ x: position.x + i, y: position.y });
    }
  } else {
    for (let i = 0; i < size; i++) {
      cells.push({ x: position.x, y: position.y + i });
    }
  }
  
  return cells;
} 