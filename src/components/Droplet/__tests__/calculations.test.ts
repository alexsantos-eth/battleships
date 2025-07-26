import {
  calculateDropletStartPosition,
  calculateDropletEndPosition,
  calculateDropletAnimation,
  calculateDropletDistance,
  validateDropletDirection,
  DROPLET_DISTANCE,
  DROPLET_START_Z,
  DROPLET_END_Z,
  DROPLET_START_OPACITY,
  DROPLET_END_OPACITY,
  DROPLET_ANIMATION_DURATION,
} from '../calculations';

describe('Droplet Calculations', () => {
  describe('calculateDropletStartPosition', () => {
    it('should calculate start position correctly', () => {
      const basePosition: [number, number] = [0, 0];
      const startPos = calculateDropletStartPosition(basePosition);
      
      expect(startPos.x).toBe(0);
      expect(startPos.y).toBe(0);
      expect(startPos.z).toBe(DROPLET_START_Z);
    });

    it('should handle different base positions', () => {
      const basePosition: [number, number] = [1.5, -2.3];
      const startPos = calculateDropletStartPosition(basePosition);
      
      expect(startPos.x).toBe(1.5);
      expect(startPos.y).toBe(-2.3);
      expect(startPos.z).toBe(DROPLET_START_Z);
    });
  });

  describe('calculateDropletEndPosition', () => {
    it('should calculate end position with unit direction', () => {
      const basePosition: [number, number] = [0, 0];
      const direction: [number, number] = [1, 0];
      const endPos = calculateDropletEndPosition(basePosition, direction);
      
      expect(endPos.x).toBe(DROPLET_DISTANCE);
      expect(endPos.y).toBe(0);
      expect(endPos.z).toBe(DROPLET_END_Z);
    });

    it('should calculate end position with diagonal direction', () => {
      const basePosition: [number, number] = [0, 0];
      const direction: [number, number] = [1, 1];
      const endPos = calculateDropletEndPosition(basePosition, direction);
      
      expect(endPos.x).toBe(DROPLET_DISTANCE);
      expect(endPos.y).toBe(DROPLET_DISTANCE);
      expect(endPos.z).toBe(DROPLET_END_Z);
    });

    it('should handle non-zero base position', () => {
      const basePosition: [number, number] = [2, 3];
      const direction: [number, number] = [0.5, -0.5];
      const endPos = calculateDropletEndPosition(basePosition, direction);
      
      expect(endPos.x).toBe(2 + 0.5 * DROPLET_DISTANCE);
      expect(endPos.y).toBe(3 - 0.5 * DROPLET_DISTANCE);
      expect(endPos.z).toBe(DROPLET_END_Z);
    });
  });

  describe('calculateDropletAnimation', () => {
    it('should calculate complete animation correctly', () => {
      const basePosition: [number, number] = [0, 0];
      const direction: [number, number] = [1, 0];
      const animation = calculateDropletAnimation(basePosition, direction);
      
      expect(animation.from.x).toBe(0);
      expect(animation.from.y).toBe(0);
      expect(animation.from.z).toBe(DROPLET_START_Z);
      
      expect(animation.to.x).toBe(DROPLET_DISTANCE);
      expect(animation.to.y).toBe(0);
      expect(animation.to.z).toBe(DROPLET_END_Z);
      
      expect(animation.opacity.from).toBe(DROPLET_START_OPACITY);
      expect(animation.opacity.to).toBe(DROPLET_END_OPACITY);
    });

    it('should handle different directions', () => {
      const basePosition: [number, number] = [1, 1];
      const direction: [number, number] = [-1, -1];
      const animation = calculateDropletAnimation(basePosition, direction);
      
      expect(animation.from.x).toBe(1);
      expect(animation.from.y).toBe(1);
      expect(animation.from.z).toBe(DROPLET_START_Z);
      
      expect(animation.to.x).toBe(1 - DROPLET_DISTANCE);
      expect(animation.to.y).toBe(1 - DROPLET_DISTANCE);
      expect(animation.to.z).toBe(DROPLET_END_Z);
    });
  });

  describe('calculateDropletDistance', () => {
    it('should calculate distance for unit direction', () => {
      const direction: [number, number] = [1, 0];
      const distance = calculateDropletDistance(direction);
      expect(distance).toBe(DROPLET_DISTANCE);
    });

    it('should calculate distance for diagonal direction', () => {
      const direction: [number, number] = [1, 1];
      const distance = calculateDropletDistance(direction);
      const expectedDistance = Math.sqrt(2) * DROPLET_DISTANCE;
      expect(distance).toBeCloseTo(expectedDistance, 10);
    });

    it('should handle zero direction', () => {
      const direction: [number, number] = [0, 0];
      const distance = calculateDropletDistance(direction);
      expect(distance).toBe(0);
    });

    it('should handle negative direction', () => {
      const direction: [number, number] = [-1, 0];
      const distance = calculateDropletDistance(direction);
      expect(distance).toBe(DROPLET_DISTANCE);
    });
  });

  describe('validateDropletDirection', () => {
    it('should validate non-zero directions', () => {
      expect(validateDropletDirection([1, 0])).toBe(true);
      expect(validateDropletDirection([0, 1])).toBe(true);
      expect(validateDropletDirection([0.5, 0.5])).toBe(true);
      expect(validateDropletDirection([-1, 0])).toBe(true);
    });

    it('should reject zero direction', () => {
      expect(validateDropletDirection([0, 0])).toBe(false);
    });

    it('should handle very small directions', () => {
      expect(validateDropletDirection([0.001, 0])).toBe(true);
      expect(validateDropletDirection([0, 0.001])).toBe(true);
    });
  });

  describe('Constants', () => {
    it('should have correct droplet distance', () => {
      expect(DROPLET_DISTANCE).toBe(0.5);
    });

    it('should have correct z positions', () => {
      expect(DROPLET_START_Z).toBe(0.15);
      expect(DROPLET_END_Z).toBe(0.5);
    });

    it('should have correct opacity values', () => {
      expect(DROPLET_START_OPACITY).toBe(1);
      expect(DROPLET_END_OPACITY).toBe(0);
    });

    it('should have correct animation duration', () => {
      expect(DROPLET_ANIMATION_DURATION).toBe(400);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between start and end positions', () => {
      const basePosition: [number, number] = [2, 3];
      const direction: [number, number] = [0.5, 0.5];
      
      const startPos = calculateDropletStartPosition(basePosition);
      const endPos = calculateDropletEndPosition(basePosition, direction);
      const animation = calculateDropletAnimation(basePosition, direction);
      
      expect(startPos.x).toBe(animation.from.x);
      expect(startPos.y).toBe(animation.from.y);
      expect(startPos.z).toBe(animation.from.z);
      
      expect(endPos.x).toBe(animation.to.x);
      expect(endPos.y).toBe(animation.to.y);
      expect(endPos.z).toBe(animation.to.z);
    });

    it('should handle various direction magnitudes', () => {
      const basePosition: [number, number] = [0, 0];
      const directions: [number, number][] = [
        [1, 0],
        [0, 1],
        [1, 1],
        [0.5, 0.5],
        [-1, 0],
        [0, -1],
      ];
      
      directions.forEach(direction => {
        const animation = calculateDropletAnimation(basePosition, direction);
        const distance = calculateDropletDistance(direction);
        
        expect(validateDropletDirection(direction)).toBe(true);
        expect(distance).toBeGreaterThan(0);
        expect(animation.opacity.from).toBe(DROPLET_START_OPACITY);
        expect(animation.opacity.to).toBe(DROPLET_END_OPACITY);
      });
    });

    it('should calculate correct movement vectors', () => {
      const basePosition: [number, number] = [1, 1];
      const direction: [number, number] = [0.5, -0.5];
      
      const startPos = calculateDropletStartPosition(basePosition);
      const endPos = calculateDropletEndPosition(basePosition, direction);
      
      const deltaX = endPos.x - startPos.x;
      const deltaY = endPos.y - startPos.y;
      
      expect(deltaX).toBeCloseTo(0.5 * DROPLET_DISTANCE, 10);
      expect(deltaY).toBeCloseTo(-0.5 * DROPLET_DISTANCE, 10);
      expect(endPos.z - startPos.z).toBe(DROPLET_END_Z - DROPLET_START_Z);
    });
  });
}); 