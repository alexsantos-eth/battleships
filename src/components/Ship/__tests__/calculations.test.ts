import {
  calculateShipPosition,
  calculateShipRotation,
  calculateShipPlaneSize,
  calculateWaveAnimation,
  calculateOrientationOffset,
  calculateGroupOffset,
  calculateShipModelOffset,
} from '../calculations';

describe('Ship Calculations', () => {
  describe('calculateShipPosition', () => {
    it('should calculate position for horizontal ship', () => {
      const position = calculateShipPosition([0, 0], 10, 10, 'horizontal', 2, 0);
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(position).toHaveProperty('z');
      expect(position.z).toBe(0.18);
    });

    it('should calculate position for vertical ship', () => {
      const position = calculateShipPosition([0, 0], 10, 10, 'vertical', 2, 0);
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(position).toHaveProperty('z');
      expect(position.z).toBe(0.18);
    });

    it('should handle different ship sizes', () => {
      const smallShip = calculateShipPosition([0, 0], 10, 10, 'horizontal', 2, 0);
      const largeShip = calculateShipPosition([0, 0], 10, 10, 'horizontal', 5, 0);
      expect(smallShip.x).not.toBe(largeShip.x);
      expect(smallShip.x !== largeShip.x || smallShip.y !== largeShip.y).toBe(true);
    });
  });

  describe('calculateShipModelOffset', () => {
    it('should return correct offset for horizontal orientation', () => {
      const shipOffset = {
        horizontal: { x: 0.1, y: 0.2, z: 0.05 },
        vertical: { x: 0.3, y: 0.4, z: 0.06 },
      };
      const result = calculateShipModelOffset(shipOffset, 'horizontal');
      
      expect(result.x).toBeCloseTo(0.1, 10);
      expect(result.y).toBeCloseTo(0.2, 10);
      expect(result.z).toBeCloseTo(0.05, 10);
    });

    it('should return correct offset for vertical orientation', () => {
      const shipOffset = {
        horizontal: { x: 0.1, y: 0.2, z: 0.05 },
        vertical: { x: 0.3, y: 0.4, z: 0.06 },
      };
      const result = calculateShipModelOffset(shipOffset, 'vertical');
      
      expect(result.x).toBeCloseTo(0.3, 10);
      expect(result.y).toBeCloseTo(0.4, 10);
      expect(result.z).toBeCloseTo(0.06, 10);
    });

    it('should handle zero offsets', () => {
      const shipOffset = {
        horizontal: { x: 0, y: 0, z: 0 },
        vertical: { x: 0, y: 0, z: 0 },
      };
      const horizontalResult = calculateShipModelOffset(shipOffset, 'horizontal');
      const verticalResult = calculateShipModelOffset(shipOffset, 'vertical');
      
      expect(horizontalResult.x).toBe(0);
      expect(horizontalResult.y).toBe(0);
      expect(horizontalResult.z).toBe(0);
      expect(verticalResult.x).toBe(0);
      expect(verticalResult.y).toBe(0);
      expect(verticalResult.z).toBe(0);
    });

    it('should handle negative offsets', () => {
      const shipOffset = {
        horizontal: { x: -0.1, y: -0.2, z: -0.05 },
        vertical: { x: -0.3, y: -0.4, z: -0.06 },
      };
      const horizontalResult = calculateShipModelOffset(shipOffset, 'horizontal');
      const verticalResult = calculateShipModelOffset(shipOffset, 'vertical');
      
      expect(horizontalResult.x).toBeCloseTo(-0.1, 10);
      expect(horizontalResult.y).toBeCloseTo(-0.2, 10);
      expect(horizontalResult.z).toBeCloseTo(-0.05, 10);
      expect(verticalResult.x).toBeCloseTo(-0.3, 10);
      expect(verticalResult.y).toBeCloseTo(-0.4, 10);
      expect(verticalResult.z).toBeCloseTo(-0.06, 10);
    });
  });

  describe('calculateGroupOffset', () => {
    it('should return correct offset for horizontal orientation', () => {
      const groupOffset = { x: 0.1, y: 0.2, z: 0.05 };
      const result = calculateGroupOffset(groupOffset, 'horizontal', 0.05);
      
      expect(result.x).toBeCloseTo(0.15, 10);
      expect(result.y).toBeCloseTo(0.2, 10);
      expect(result.z).toBeCloseTo(0.05, 10);
    });

    it('should return correct offset for vertical orientation', () => {
      const groupOffset = { x: 0.1, y: 0.2, z: 0.05 };
      const result = calculateGroupOffset(groupOffset, 'vertical', 0.05);
      
      expect(result.x).toBeCloseTo(0.25, 10);
      expect(result.y).toBeCloseTo(0.1, 10);
      expect(result.z).toBeCloseTo(0.05, 10);
    });

    it('should handle zero offsets', () => {
      const groupOffset = { x: 0, y: 0, z: 0 };
      const horizontalResult = calculateGroupOffset(groupOffset, 'horizontal', 0);
      const verticalResult = calculateGroupOffset(groupOffset, 'vertical', 0);
      
      expect(horizontalResult.x).toBe(0);
      expect(horizontalResult.y).toBe(0);
      expect(horizontalResult.z).toBe(0);
      expect(verticalResult.x).toBe(0);
      expect(verticalResult.y).toBe(0);
      expect(verticalResult.z).toBe(0);
    });

    it('should handle negative offsets', () => {
      const groupOffset = { x: -0.1, y: -0.2, z: -0.05 };
      const horizontalResult = calculateGroupOffset(groupOffset, 'horizontal', -0.1);
      const verticalResult = calculateGroupOffset(groupOffset, 'vertical', -0.1);
      
      expect(horizontalResult.x).toBeCloseTo(-0.2, 10);
      expect(horizontalResult.y).toBeCloseTo(-0.2, 10);
      expect(horizontalResult.z).toBeCloseTo(-0.05, 10);
      expect(verticalResult.x).toBeCloseTo(-0.3, 10);
      expect(verticalResult.y).toBeCloseTo(-0.1, 10);
      expect(verticalResult.z).toBeCloseTo(-0.05, 10);
    });

    it('should handle extraOffset without groupOffset', () => {
      const groupOffset = { x: 0, y: 0, z: 0 };
      const horizontalResult = calculateGroupOffset(groupOffset, 'horizontal', 0.1);
      const verticalResult = calculateGroupOffset(groupOffset, 'vertical', 0.1);
      
      expect(horizontalResult.x).toBeCloseTo(0.1, 10);
      expect(horizontalResult.y).toBe(0);
      expect(horizontalResult.z).toBe(0);
      expect(verticalResult.x).toBeCloseTo(0.1, 10);
      expect(verticalResult.y).toBe(0);
      expect(verticalResult.z).toBe(0);
    });
  });

  describe('calculateShipRotation', () => {
    it('should return correct rotation for horizontal orientation', () => {
      const rotation = calculateShipRotation('horizontal');
      expect(rotation.x).toBe(-Math.PI / 2);
      expect(rotation.y).toBe(Math.PI / 2);
      expect(rotation.z).toBe(-Math.PI);
    });

    it('should return correct rotation for vertical orientation', () => {
      const rotation = calculateShipRotation('vertical');
      expect(rotation.x).toBe(-Math.PI / 2);
      expect(rotation.y).toBe(0);
      expect(rotation.z).toBe(Math.PI);
    });
  });

  describe('calculateShipPlaneSize', () => {
    it('should calculate horizontal plane size correctly', () => {
      const size = calculateShipPlaneSize(3, 'horizontal');
      expect(size.width).toBe(1.5);
      expect(size.height).toBe(0.5);
    });

    it('should calculate vertical plane size correctly', () => {
      const size = calculateShipPlaneSize(3, 'vertical');
      expect(size.width).toBe(0.5);
      expect(size.height).toBe(1.5);
    });
  });

  describe('calculateWaveAnimation', () => {
    it('should calculate wave animation with correct frequency and amplitude', () => {
      const time = 1.0;
      const frequency = 3.0;
      const amplitude = 0.02;
      const coords: [number, number] = [0, 0];

      const animation = calculateWaveAnimation(time, frequency, amplitude, coords);
      
      expect(animation.y).toBeCloseTo(Math.sin(time * frequency) * amplitude, 10);
      expect(animation.z).toBeCloseTo(Math.cos(time * frequency * 0.7) * (amplitude * 0.5), 10);
    });
  });

  describe('calculateOrientationOffset', () => {
    it('should return correct offset for horizontal orientation', () => {
      const offset = calculateOrientationOffset('horizontal', 0.1);
      expect(offset.x).toBe(0.1);
      expect(offset.y).toBe(0);
    });

    it('should return correct offset for vertical orientation', () => {
      const offset = calculateOrientationOffset('vertical', 0.1);
      expect(offset.x).toBe(0);
      expect(offset.y).toBe(0.1);
    });
  });
}); 