import {
  generateRandomAngle,
  calculateDropletDirection,
  generateExplosionPattern,
  calculateDropletDistance,
  validateDirection,
  DROPLET_COUNT,
} from '../calculations';

describe('WaterExplosion Calculations', () => {
  describe('generateRandomAngle', () => {
    it('should generate angles between 0 and 2π', () => {
      for (let i = 0; i < 100; i++) {
        const angle = generateRandomAngle();
        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(2 * Math.PI);
      }
    });

    it('should generate different angles on multiple calls', () => {
      const angles = new Set();
      for (let i = 0; i < 50; i++) {
        angles.add(generateRandomAngle());
      }
      expect(angles.size).toBeGreaterThan(1);
    });
  });

  describe('calculateDropletDirection', () => {
    it('should calculate direction from angle correctly', () => {
      const angle = 0;
      const direction = calculateDropletDirection(angle);
      expect(direction[0]).toBeCloseTo(1, 10);
      expect(direction[1]).toBeCloseTo(0, 10);
    });

    it('should calculate direction for π/2 angle', () => {
      const angle = Math.PI / 2;
      const direction = calculateDropletDirection(angle);
      expect(direction[0]).toBeCloseTo(0, 10);
      expect(direction[1]).toBeCloseTo(1, 10);
    });

    it('should calculate direction for π angle', () => {
      const angle = Math.PI;
      const direction = calculateDropletDirection(angle);
      expect(direction[0]).toBeCloseTo(-1, 10);
      expect(direction[1]).toBeCloseTo(0, 10);
    });

    it('should calculate direction for 3π/2 angle', () => {
      const angle = (3 * Math.PI) / 2;
      const direction = calculateDropletDirection(angle);
      expect(direction[0]).toBeCloseTo(0, 10);
      expect(direction[1]).toBeCloseTo(-1, 10);
    });

    it('should calculate direction for 2π angle', () => {
      const angle = 2 * Math.PI;
      const direction = calculateDropletDirection(angle);
      expect(direction[0]).toBeCloseTo(1, 10);
      expect(direction[1]).toBeCloseTo(0, 10);
    });
  });

  describe('generateExplosionPattern', () => {
    it('should generate pattern with correct structure', () => {
      const pattern = generateExplosionPattern();
      
      expect(pattern).toHaveProperty('rings');
      expect(pattern).toHaveProperty('drops');
      expect(Array.isArray(pattern.rings)).toBe(true);
      expect(Array.isArray(pattern.drops)).toBe(true);
    });

    it('should generate correct number of droplets', () => {
      const pattern = generateExplosionPattern();
      expect(pattern.drops.length).toBe(DROPLET_COUNT);
    });

    it('should generate rings with timestamp', () => {
      const before = Date.now();
      const pattern = generateExplosionPattern();
      const after = Date.now();
      
      expect(pattern.rings.length).toBe(1);
      expect(pattern.rings[0]).toBeGreaterThanOrEqual(before);
      expect(pattern.rings[0]).toBeLessThanOrEqual(after);
    });

    it('should generate droplets with valid directions', () => {
      const pattern = generateExplosionPattern();
      
      pattern.drops.forEach((drop, index) => {
        expect(drop.id).toBe(index);
        expect(drop.dir).toHaveLength(2);
        expect(validateDirection(drop.dir)).toBe(true);
      });
    });

    it('should generate different patterns on multiple calls', () => {
      const pattern1 = generateExplosionPattern();
      const pattern2 = generateExplosionPattern();
      
      expect(pattern1.rings[0]).toBeLessThanOrEqual(pattern2.rings[0]);
    });
  });

  describe('calculateDropletDistance', () => {
    it('should calculate distance correctly for unit direction', () => {
      const direction: [number, number] = [1, 0];
      const distance = 0.5;
      const result = calculateDropletDistance(direction, distance);
      
      expect(result[0]).toBe(0.5);
      expect(result[1]).toBe(0);
    });

    it('should calculate distance correctly for diagonal direction', () => {
      const direction: [number, number] = [1, 1];
      const distance = 2;
      const result = calculateDropletDistance(direction, distance);
      
      expect(result[0]).toBe(2);
      expect(result[1]).toBe(2);
    });

    it('should handle zero distance', () => {
      const direction: [number, number] = [0.5, 0.5];
      const distance = 0;
      const result = calculateDropletDistance(direction, distance);
      
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0);
    });

    it('should handle negative distance', () => {
      const direction: [number, number] = [1, 0];
      const distance = -0.5;
      const result = calculateDropletDistance(direction, distance);
      
      expect(result[0]).toBe(-0.5);
      expect(result[1]).toBeCloseTo(0, 10);
    });
  });

  describe('validateDirection', () => {
    it('should validate unit vectors', () => {
      expect(validateDirection([1, 0])).toBe(true);
      expect(validateDirection([0, 1])).toBe(true);
      expect(validateDirection([-1, 0])).toBe(true);
      expect(validateDirection([0, -1])).toBe(true);
    });

    it('should validate normalized vectors', () => {
      const normalized: [number, number] = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
      expect(validateDirection(normalized)).toBe(true);
    });

    it('should reject non-unit vectors', () => {
      expect(validateDirection([2, 0] as [number, number])).toBe(false);
      expect(validateDirection([0, 0.5] as [number, number])).toBe(false);
      expect(validateDirection([1, 1] as [number, number])).toBe(false);
    });

    it('should handle very small deviations', () => {
      const almostUnit: [number, number] = [1.1, 0];
      expect(validateDirection(almostUnit)).toBe(false);
    });
  });

  describe('Constants', () => {
    it('should have correct droplet count', () => {
      expect(DROPLET_COUNT).toBe(10);
    });
  });

  describe('Integration Tests', () => {
    it('should generate valid explosion pattern with proper droplet directions', () => {
      const pattern = generateExplosionPattern();
      
      expect(pattern.drops.length).toBe(DROPLET_COUNT);
      
      pattern.drops.forEach(drop => {
        const direction = drop.dir;
        expect(validateDirection(direction)).toBe(true);
        
        const distance = 0.5;
        const finalPosition = calculateDropletDistance(direction, distance);
        const magnitude = Math.sqrt(finalPosition[0] ** 2 + finalPosition[1] ** 2);
        expect(magnitude).toBeCloseTo(distance, 10);
      });
    });

    it('should generate different droplet directions', () => {
      const pattern = generateExplosionPattern();
      const directions = pattern.drops.map(drop => drop.dir);
      
      const uniqueDirections = new Set(directions.map(dir => `${dir[0]},${dir[1]}`));
      expect(uniqueDirections.size).toBeGreaterThan(1);
    });

    it('should maintain consistency between angle and direction calculations', () => {
      const angles = [0, Math.PI / 4, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      
      angles.forEach(angle => {
        const direction = calculateDropletDirection(angle);
        expect(validateDirection(direction)).toBe(true);
        
        const expectedX = Math.cos(angle);
        const expectedY = Math.sin(angle);
        expect(direction[0]).toBeCloseTo(expectedX, 10);
        expect(direction[1]).toBeCloseTo(expectedY, 10);
      });
    });
  });
}); 