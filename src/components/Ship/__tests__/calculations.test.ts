import {
  calculateShipPosition,
  calculateShipRotation,
  calculateShipPlaneSize,
  calculateWaveAnimation,
  calculateOrientationOffset,
  SHIP_SPACING,
  GRID_SIZE,
} from '../calculations';

describe('Ship Calculations', () => {
  describe('calculateShipPosition', () => {
    it('should calculate horizontal ship position correctly', () => {
      const position = calculateShipPosition([0, 0], 'horizontal', 2, 0);
      expect(position.x).toBeCloseTo(-2, 10);
      expect(position.y).toBeCloseTo(-2.25, 10);
      expect(position.z).toBe(0.18);
    });

    it('should calculate vertical ship position correctly', () => {
      const position = calculateShipPosition([0, 0], 'vertical', 2, 0);
      expect(position.x).toBeCloseTo(-2.25, 10);
      expect(position.y).toBeCloseTo(-2, 10);
      expect(position.z).toBe(0.18);
    });

    it('should handle extra offset for horizontal orientation', () => {
      const position = calculateShipPosition([5, 5], 'horizontal', 3, -0.1);
      expect(position.x).toBeCloseTo(0.65, 10);
      expect(position.y).toBeCloseTo(0.25, 10);
    });

    it('should handle extra offset for vertical orientation', () => {
      const position = calculateShipPosition([5, 5], 'vertical', 3, -0.1);
      expect(position.x).toBeCloseTo(0.25, 10);
      expect(position.y).toBeCloseTo(0.65, 10);
    });

    it('should calculate different ship sizes correctly', () => {
      const smallShip = calculateShipPosition([0, 0], 'horizontal', 2, 0);
      const largeShip = calculateShipPosition([0, 0], 'horizontal', 5, 0);
      
      expect(smallShip.x).toBeCloseTo(-2, 10);
      expect(largeShip.x).toBeCloseTo(-1.25, 10);
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

    it('should handle different ship sizes', () => {
      const smallSize = calculateShipPlaneSize(2, 'horizontal');
      const largeSize = calculateShipPlaneSize(5, 'horizontal');
      
      expect(smallSize.width).toBe(1.0);
      expect(largeSize.width).toBe(2.5);
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

    it('should include phase based on coordinates', () => {
      const time = 0;
      const frequency = 2.0;
      const amplitude = 0.03;
      const coords1: [number, number] = [0, 0];
      const coords2: [number, number] = [1, 1];

      const animation1 = calculateWaveAnimation(time, frequency, amplitude, coords1);
      const animation2 = calculateWaveAnimation(time, frequency, amplitude, coords2);

      expect(animation1.y).toBeCloseTo(Math.sin(0) * amplitude, 10);
      expect(animation2.y).toBeCloseTo(Math.sin(1) * amplitude, 10);
    });

    it('should handle different time values', () => {
      const frequency = 3.0;
      const amplitude = 0.02;
      const coords: [number, number] = [0, 0];

      const animation1 = calculateWaveAnimation(0, frequency, amplitude, coords);
      const animation2 = calculateWaveAnimation(Math.PI / 2, frequency, amplitude, coords);

      expect(animation1.y).toBeCloseTo(0, 10);
      expect(animation2.y).toBeCloseTo(-amplitude, 10);
    });
  });

  describe('calculateOrientationOffset', () => {
    it('should return zero offset for horizontal orientation', () => {
      const offset = calculateOrientationOffset('horizontal', 0.1);
      expect(offset.x).toBe(0.1);
      expect(offset.y).toBe(0);
    });

    it('should return zero offset for vertical orientation', () => {
      const offset = calculateOrientationOffset('vertical', 0.1);
      expect(offset.x).toBe(0);
      expect(offset.y).toBe(0.1);
    });

    it('should handle negative offsets', () => {
      const horizontalOffset = calculateOrientationOffset('horizontal', -0.1);
      const verticalOffset = calculateOrientationOffset('vertical', -0.1);
      
      expect(horizontalOffset.x).toBe(-0.1);
      expect(horizontalOffset.y).toBe(0);
      expect(verticalOffset.x).toBe(0);
      expect(verticalOffset.y).toBe(-0.1);
    });
  });

  describe('Constants', () => {
    it('should have correct spacing value', () => {
      expect(SHIP_SPACING).toBe(0.5);
    });

    it('should have correct grid size', () => {
      expect(GRID_SIZE).toBe(10);
    });

    it('should calculate grid center offset correctly', () => {
      const gridCenterOffset = (SHIP_SPACING * GRID_SIZE) / 2;
      expect(gridCenterOffset).toBe(2.5);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain consistency between position and plane size calculations', () => {
      const coords: [number, number] = [5, 5];
      const shipSize = 3;
      const orientation = 'horizontal' as const;

      const position = calculateShipPosition(coords, orientation, shipSize, 0);
      const planeSize = calculateShipPlaneSize(shipSize, orientation);

      expect(position.x).toBeCloseTo(0.75, 10);
      expect(position.y).toBeCloseTo(0.25, 10);
      expect(planeSize.width).toBe(1.5);
      expect(planeSize.height).toBe(0.5);
    });

    it('should handle all ship variants correctly', () => {
      const coords: [number, number] = [0, 0];
      const shipSizes = [2, 3, 4, 5];
      const orientations = ['horizontal', 'vertical'] as const;

      shipSizes.forEach(size => {
        orientations.forEach(orientation => {
          const position = calculateShipPosition(coords, orientation, size, 0);
          const rotation = calculateShipRotation(orientation);
          const planeSize = calculateShipPlaneSize(size, orientation);

          expect(position.z).toBe(0.18);
          expect(rotation.x).toBe(-Math.PI / 2);
          expect(planeSize.width + planeSize.height).toBe(size * SHIP_SPACING + SHIP_SPACING);
          
          if (orientation === 'horizontal') {
            expect(position.y).toBeCloseTo(-2.25, 10);
          } else {
            expect(position.x).toBeCloseTo(-2.25, 10);
          }
        });
      });
    });
  });
}); 