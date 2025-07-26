import {
  worldToGridCoordinates,
  gridToWorldCoordinates,
  isValidGridPosition,
  calculateGridCenterOffset,
  calculateTotalGridWidth,
  GRID_SPACING,
} from '../utils';

describe('PressGrid Calculations', () => {
  describe('Grid Position Calculations', () => {
    it('should convert world coordinates to grid coordinates correctly', () => {

      expect(worldToGridCoordinates([0, 0, 0])).toEqual([5, 5]);
      expect(worldToGridCoordinates([-2.25, -2.25, 0])).toEqual([0, 0]);
      expect(worldToGridCoordinates([2.25, 2.25, 0])).toEqual([9, 9]);
      expect(worldToGridCoordinates([-1.25, 1.25, 0])).toEqual([2, 7]);
      expect(worldToGridCoordinates([1.25, -1.25, 0])).toEqual([7, 2]);
    });

    it('should handle edge cases for grid boundaries', () => {
      const result1 = worldToGridCoordinates([-2.5, -2.5, 0]);
      expect(result1[0]).toBeCloseTo(0, 10);
      expect(result1[1]).toBeCloseTo(0, 10);
      expect(worldToGridCoordinates([2.5, 2.5, 0])).toEqual([10, 10]);
    });
  });

  describe('Cell Position Calculations', () => {
    it('should convert grid coordinates to world coordinates correctly', () => {

      expect(gridToWorldCoordinates(0, 0)).toEqual([-2.25, -2.25]);
      expect(gridToWorldCoordinates(5, 5)).toEqual([0.25, 0.25]);
      expect(gridToWorldCoordinates(9, 9)).toEqual([2.25, 2.25]);
      expect(gridToWorldCoordinates(2, 8)).toEqual([-1.25, 1.75]);
      expect(gridToWorldCoordinates(8, 2)).toEqual([1.75, -1.25]);
    });

    it('should handle all grid positions', () => {
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          const [posX, posY] = gridToWorldCoordinates(x, y);
          expect(posX).toBeCloseTo(x * 0.5 - 2.25, 10);
          expect(posY).toBeCloseTo(y * 0.5 - 2.25, 10);
        }
      }
    });
  });

  describe('Coordinate Round Trip', () => {
    it('should maintain consistency between world and grid coordinate conversions', () => {
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          const [worldX, worldY] = gridToWorldCoordinates(x, y);
          const [gridX, gridY] = worldToGridCoordinates([worldX, worldY, 0]);
          expect(gridX).toBe(x);
          expect(gridY).toBe(y);
        }
      }
    });
  });

  describe('Grid Boundaries', () => {
    it('should correctly identify valid grid positions', () => {
      expect(isValidGridPosition(0, 0)).toBe(true);
      expect(isValidGridPosition(9, 9)).toBe(true);
      expect(isValidGridPosition(5, 5)).toBe(true);
      expect(isValidGridPosition(-1, 0)).toBe(false);
      expect(isValidGridPosition(0, -1)).toBe(false);
      expect(isValidGridPosition(10, 0)).toBe(false);
      expect(isValidGridPosition(0, 10)).toBe(false);
      expect(isValidGridPosition(15, 15)).toBe(false);
    });
  });

  describe('Spacing Constants', () => {
    it('should have correct spacing value', () => {
      expect(GRID_SPACING).toBe(0.5);
    });

    it('should calculate grid size correctly', () => {
      expect(calculateTotalGridWidth()).toBe(5);
    });

    it('should calculate grid center offset correctly', () => {
      expect(calculateGridCenterOffset()).toBe(2.25);
    });
  });
}); 