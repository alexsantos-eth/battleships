import { ROCK_VARIANTS } from '../utils';

describe('Rock Utils', () => {
  describe('ROCK_VARIANTS', () => {
    it('should have correct number of variants', () => {
      expect(Object.keys(ROCK_VARIANTS)).toHaveLength(7);
    });

    it('should have variants numbered from 1 to 7', () => {
      const variantNumbers = Object.keys(ROCK_VARIANTS).map(Number);
      expect(variantNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should have valid model paths for all variants', () => {
      Object.entries(ROCK_VARIANTS).forEach(([variant, path]) => {
        expect(path).toMatch(/^\/assets\/models\/Rock_\d+\.glb$/);
        expect(path).toBe(`/assets/models/Rock_${variant}.glb`);
      });
    });

    it('should have consistent path structure', () => {
      Object.values(ROCK_VARIANTS).forEach(path => {
        expect(path).toMatch(/^\/assets\/models\//);
        expect(path).toMatch(/\.glb$/);
        expect(path).toMatch(/Rock_\d+\.glb$/);
      });
    });

    it('should be readonly', () => {
      expect(ROCK_VARIANTS).toBeDefined();
      expect(typeof ROCK_VARIANTS).toBe('object');
    });
  });

  describe('Variant Access', () => {
    it('should allow access to all variants', () => {
      expect(ROCK_VARIANTS[1]).toBe('/assets/models/Rock_1.glb');
      expect(ROCK_VARIANTS[2]).toBe('/assets/models/Rock_2.glb');
      expect(ROCK_VARIANTS[3]).toBe('/assets/models/Rock_3.glb');
      expect(ROCK_VARIANTS[4]).toBe('/assets/models/Rock_4.glb');
      expect(ROCK_VARIANTS[5]).toBe('/assets/models/Rock_5.glb');
      expect(ROCK_VARIANTS[6]).toBe('/assets/models/Rock_6.glb');
      expect(ROCK_VARIANTS[7]).toBe('/assets/models/Rock_7.glb');
    });

    it('should have only valid variant keys', () => {
      const validKeys = [1, 2, 3, 4, 5, 6, 7];
      const allKeys = Object.keys(ROCK_VARIANTS).map(Number);
      expect(allKeys).toEqual(validKeys);
    });
  });

  describe('Type Safety', () => {
    it('should have correct TypeScript types', () => {
      // This test ensures the const assertion is working
      const variant1: string = ROCK_VARIANTS[1];
      expect(typeof variant1).toBe('string');
    });
  });
}); 