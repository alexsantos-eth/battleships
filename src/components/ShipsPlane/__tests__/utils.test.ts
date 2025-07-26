import { getRandomShips } from '../utils';

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

describe('ShipsPlane Utils', () => {
  describe('getRandomShips', () => {
    it('should return correct number of ships', () => {
      mockRandom.mockReturnValue(0.5); // Consistent random values
      
      const ships = getRandomShips();
      
      expect(ships).toHaveLength(5);
    });

    it('should return ships with correct variants', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      const variants = ships.map(ship => ship.variant);
      expect(variants).toEqual(['small', 'medium', 'medium', 'large', 'xlarge']);
    });

    it('should return ships with valid coordinates', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      ships.forEach(ship => {
        expect(ship.coords).toHaveLength(2);
        expect(ship.coords[0]).toBeGreaterThanOrEqual(0);
        expect(ship.coords[0]).toBeLessThan(10);
        expect(ship.coords[1]).toBeGreaterThanOrEqual(0);
        expect(ship.coords[1]).toBeLessThan(10);
      });
    });

    it('should return ships with valid orientations', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      ships.forEach(ship => {
        expect(['horizontal', 'vertical']).toContain(ship.orientation);
      });
    });

    it('should handle horizontal orientation correctly', () => {
      // Mock to always return horizontal orientation
      mockRandom.mockReturnValue(0.1); // < 0.5 for horizontal
      
      const ships = getRandomShips();
      
      ships.forEach(ship => {
        if (ship.variant === 'small') {
          expect(ship.coords[0]).toBeLessThanOrEqual(10 - 2); // size 2
        } else if (ship.variant === 'medium') {
          expect(ship.coords[0]).toBeLessThanOrEqual(10 - 3); // size 3
        } else if (ship.variant === 'large') {
          expect(ship.coords[0]).toBeLessThanOrEqual(10 - 4); // size 4
        } else if (ship.variant === 'xlarge') {
          expect(ship.coords[0]).toBeLessThanOrEqual(10 - 5); // size 5
        }
      });
    });

    it('should handle vertical orientation correctly', () => {
      // Mock to always return vertical orientation
      mockRandom.mockReturnValue(0.9); // > 0.5 for vertical
      
      const ships = getRandomShips();
      
      ships.forEach(ship => {
        if (ship.variant === 'small') {
          expect(ship.coords[1]).toBeLessThanOrEqual(10 - 2); // size 2
        } else if (ship.variant === 'medium') {
          expect(ship.coords[1]).toBeLessThanOrEqual(10 - 3); // size 3
        } else if (ship.variant === 'large') {
          expect(ship.coords[1]).toBeLessThanOrEqual(10 - 4); // size 4
        } else if (ship.variant === 'xlarge') {
          expect(ship.coords[1]).toBeLessThanOrEqual(10 - 5); // size 5
        }
      });
    });

    it('should generate different ships on multiple calls', () => {
      // Mock different random values for each call
      mockRandom
        .mockReturnValueOnce(0.1) // First call
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.3)
        .mockReturnValueOnce(0.4)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.6) // Second call
        .mockReturnValueOnce(0.7)
        .mockReturnValueOnce(0.8)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.1);
      
      const ships1 = getRandomShips();
      const ships2 = getRandomShips();
      
      // Ships should be different due to different random values
      expect(ships1).not.toEqual(ships2);
    });

    it('should handle edge case with maximum attempts', () => {
      // Mock to always return the same position to trigger max attempts
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      expect(ships).toHaveLength(5);
      ships.forEach(ship => {
        expect(ship.coords).toBeDefined();
        expect(ship.variant).toBeDefined();
        expect(ship.orientation).toBeDefined();
      });
    });

    it('should return consistent ship definitions', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      const shipSizes = ships.map(ship => {
        switch (ship.variant) {
          case 'small': return 2;
          case 'medium': return 3;
          case 'large': return 4;
          case 'xlarge': return 5;
          default: return 0;
        }
      });
      
      expect(shipSizes).toEqual([2, 3, 3, 4, 5]);
    });

    it('should handle quadrant preferences', () => {
      // Mock to use quadrant preferences
      mockRandom.mockReturnValue(0.6); // > 0.5 to trigger quadrant logic
      
      const ships = getRandomShips();
      
      expect(ships).toHaveLength(5);
      ships.forEach(ship => {
        expect(ship.coords[0]).toBeGreaterThanOrEqual(0);
        expect(ship.coords[0]).toBeLessThan(10);
        expect(ship.coords[1]).toBeGreaterThanOrEqual(0);
        expect(ship.coords[1]).toBeLessThan(10);
      });
    });
  });

  describe('Ship Placement Logic', () => {
    it('should place ships within grid boundaries', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      ships.forEach(ship => {
        const size = ship.variant === 'small' ? 2 : 
                    ship.variant === 'medium' ? 3 :
                    ship.variant === 'large' ? 4 : 5;
        
        if (ship.orientation === 'horizontal') {
          expect(ship.coords[0] + size - 1).toBeLessThan(10);
          expect(ship.coords[1]).toBeLessThan(10);
        } else {
          expect(ship.coords[0]).toBeLessThan(10);
          expect(ship.coords[1] + size - 1).toBeLessThan(10);
        }
      });
    });

    it('should handle all ship variants correctly', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      const variants = new Set(ships.map(s => s.variant));
      expect(variants).toContain('small');
      expect(variants).toContain('medium');
      expect(variants).toContain('large');
      expect(variants).toContain('xlarge');
    });

    it('should return valid ship objects', () => {
      mockRandom.mockReturnValue(0.5);
      
      const ships = getRandomShips();
      
      ships.forEach(ship => {
        expect(ship).toHaveProperty('coords');
        expect(ship).toHaveProperty('variant');
        expect(ship).toHaveProperty('orientation');
        expect(Array.isArray(ship.coords)).toBe(true);
        expect(ship.coords).toHaveLength(2);
        expect(typeof ship.variant).toBe('string');
        expect(typeof ship.orientation).toBe('string');
      });
    });
  });

  describe('Random Number Generation', () => {
    it('should use Math.random for ship generation', () => {
      mockRandom.mockReturnValue(0.5);
      
      getRandomShips();
      
      expect(mockRandom).toHaveBeenCalled();
    });

    it('should handle different random values', () => {
      // Test with different random values
      const testValues = [0.1, 0.3, 0.5, 0.7, 0.9];
      
      testValues.forEach(value => {
        mockRandom.mockReturnValue(value);
        const ships = getRandomShips();
        expect(ships).toHaveLength(5);
      });
    });
  });
}); 