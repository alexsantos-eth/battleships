import { SHIP_VARIANTS } from '../utils';
import type { ShipProps } from '../utils';

// Mock the colors import
jest.mock('@/config/colors', () => ({
  COLORS: {
    ships: {
      small: '#FF0000',
      medium: '#00FF00',
      large: '#0000FF',
      xlarge: '#FFFF00',
    },
  },
}));

describe('Ship Utils', () => {
  describe('SHIP_VARIANTS', () => {
    it('should have all required ship variants', () => {
      expect(SHIP_VARIANTS).toHaveProperty('small');
      expect(SHIP_VARIANTS).toHaveProperty('medium');
      expect(SHIP_VARIANTS).toHaveProperty('large');
      expect(SHIP_VARIANTS).toHaveProperty('xlarge');
    });

    it('should have correct sizes for each variant', () => {
      expect(SHIP_VARIANTS.small.size).toBe(2);
      expect(SHIP_VARIANTS.medium.size).toBe(3);
      expect(SHIP_VARIANTS.large.size).toBe(4);
      expect(SHIP_VARIANTS.xlarge.size).toBe(5);
    });

    it('should have valid model URLs for each variant', () => {
      expect(SHIP_VARIANTS.small.url).toBe('/assets/models/Small_Ship.glb');
      expect(SHIP_VARIANTS.medium.url).toBe('/assets/models/Medium_Ship.glb');
      expect(SHIP_VARIANTS.large.url).toBe('/assets/models/Large_Ship.glb');
      expect(SHIP_VARIANTS.xlarge.url).toBe('/assets/models/XLarge_Ship.glb');
    });

    it('should have valid scale arrays for each variant', () => {
      expect(SHIP_VARIANTS.small.scale).toEqual([0.2, 0.2, 0.2]);
      expect(SHIP_VARIANTS.medium.scale).toEqual([0.2, 0.2, 0.2]);
      expect(SHIP_VARIANTS.large.scale).toEqual([0.2, 0.2, 0.23]);
      expect(SHIP_VARIANTS.xlarge.scale).toEqual([0.2, 0.2, 0.3]);
    });

    it('should have correct extraOffset values', () => {
      expect(SHIP_VARIANTS.small.extraOffset).toBe(0);
      expect(SHIP_VARIANTS.medium.extraOffset).toBe(0);
      expect(SHIP_VARIANTS.large.extraOffset).toBe(-0.1);
      expect(SHIP_VARIANTS.xlarge.extraOffset).toBe(-0.1);
    });

    it('should have valid wave frequency values', () => {
      expect(SHIP_VARIANTS.small.waveFrequency).toBe(3.5);
      expect(SHIP_VARIANTS.medium.waveFrequency).toBe(3.0);
      expect(SHIP_VARIANTS.large.waveFrequency).toBe(2.5);
      expect(SHIP_VARIANTS.xlarge.waveFrequency).toBe(2.0);
    });

    it('should have valid wave amplitude values', () => {
      expect(SHIP_VARIANTS.small.waveAmplitude).toBe(0.02);
      expect(SHIP_VARIANTS.medium.waveAmplitude).toBe(0.025);
      expect(SHIP_VARIANTS.large.waveAmplitude).toBe(0.03);
      expect(SHIP_VARIANTS.xlarge.waveAmplitude).toBe(0.035);
    });

    it('should have color properties for each variant', () => {
      expect(SHIP_VARIANTS.small).toHaveProperty('color');
      expect(SHIP_VARIANTS.medium).toHaveProperty('color');
      expect(SHIP_VARIANTS.large).toHaveProperty('color');
      expect(SHIP_VARIANTS.xlarge).toHaveProperty('color');
    });

    it('should have consistent scale structure', () => {
      Object.values(SHIP_VARIANTS).forEach(variant => {
        expect(Array.isArray(variant.scale)).toBe(true);
        expect(variant.scale).toHaveLength(3);
        variant.scale.forEach(scaleValue => {
          expect(typeof scaleValue).toBe('number');
          expect(scaleValue).toBeGreaterThan(0);
        });
      });
    });

    it('should have valid wave parameters', () => {
      Object.values(SHIP_VARIANTS).forEach(variant => {
        expect(typeof variant.waveFrequency).toBe('number');
        expect(typeof variant.waveAmplitude).toBe('number');
        expect(variant.waveFrequency).toBeGreaterThan(0);
        expect(variant.waveAmplitude).toBeGreaterThan(0);
      });
    });
  });

  describe('ShipProps Interface', () => {
    it('should allow valid ship props', () => {
      const validProps: ShipProps = {
        coords: [5, 5],
        variant: 'medium',
        orientation: 'horizontal',
      };

      expect(validProps.coords).toEqual([5, 5]);
      expect(validProps.variant).toBe('medium');
      expect(validProps.orientation).toBe('horizontal');
    });

    it('should allow optional orientation', () => {
      const propsWithoutOrientation: ShipProps = {
        coords: [3, 7],
        variant: 'small',
      };

      expect(propsWithoutOrientation.coords).toEqual([3, 7]);
      expect(propsWithoutOrientation.variant).toBe('small');
      expect(propsWithoutOrientation.orientation).toBeUndefined();
    });

    it('should accept all variant types', () => {
      const variants: Array<ShipProps['variant']> = ['small', 'medium', 'large', 'xlarge'];
      
      variants.forEach(variant => {
        const props: ShipProps = {
          coords: [0, 0],
          variant,
        };
        expect(props.variant).toBe(variant);
      });
    });

    it('should accept all orientation types', () => {
      const orientations: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];
      
      orientations.forEach(orientation => {
        const props: ShipProps = {
          coords: [0, 0],
          variant: 'small',
          orientation,
        };
        expect(props.orientation).toBe(orientation);
      });
    });
  });

  describe('Variant Access', () => {
    it('should allow access to all variants', () => {
      expect(SHIP_VARIANTS.small).toBeDefined();
      expect(SHIP_VARIANTS.medium).toBeDefined();
      expect(SHIP_VARIANTS.large).toBeDefined();
      expect(SHIP_VARIANTS.xlarge).toBeDefined();
    });

    it('should have consistent property structure across variants', () => {
      const requiredProperties = ['size', 'url', 'scale', 'extraOffset', 'waveFrequency', 'waveAmplitude', 'color'];
      
      Object.values(SHIP_VARIANTS).forEach(variant => {
        requiredProperties.forEach(prop => {
          expect(variant).toHaveProperty(prop);
        });
      });
    });
  });

  describe('Data Validation', () => {
    it('should have increasing sizes for larger variants', () => {
      expect(SHIP_VARIANTS.small.size).toBeLessThan(SHIP_VARIANTS.medium.size);
      expect(SHIP_VARIANTS.medium.size).toBeLessThan(SHIP_VARIANTS.large.size);
      expect(SHIP_VARIANTS.large.size).toBeLessThan(SHIP_VARIANTS.xlarge.size);
    });

    it('should have decreasing wave frequencies for larger variants', () => {
      expect(SHIP_VARIANTS.small.waveFrequency).toBeGreaterThan(SHIP_VARIANTS.medium.waveFrequency);
      expect(SHIP_VARIANTS.medium.waveFrequency).toBeGreaterThan(SHIP_VARIANTS.large.waveFrequency);
      expect(SHIP_VARIANTS.large.waveFrequency).toBeGreaterThan(SHIP_VARIANTS.xlarge.waveFrequency);
    });

    it('should have increasing wave amplitudes for larger variants', () => {
      expect(SHIP_VARIANTS.small.waveAmplitude).toBeLessThan(SHIP_VARIANTS.medium.waveAmplitude);
      expect(SHIP_VARIANTS.medium.waveAmplitude).toBeLessThan(SHIP_VARIANTS.large.waveAmplitude);
      expect(SHIP_VARIANTS.large.waveAmplitude).toBeLessThan(SHIP_VARIANTS.xlarge.waveAmplitude);
    });

    it('should have valid model file paths', () => {
      Object.entries(SHIP_VARIANTS).forEach(([variant, config]) => {
        expect(config.url).toMatch(/^\/assets\/models\/[A-Za-z_]+\.glb$/);
        // Handle special case for xlarge -> XLarge
        const expectedName = variant === 'xlarge' ? 'XLarge' : variant.charAt(0).toUpperCase() + variant.slice(1);
        expect(config.url).toContain(expectedName);
      });
    });
  });
}); 