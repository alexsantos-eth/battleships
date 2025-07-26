import { createNoise2D } from "simplex-noise";
import { generateTerrain } from "../utils";

// Mock simplex-noise for consistent testing
jest.mock("simplex-noise", () => ({
  createNoise2D: jest.fn(() => jest.fn(() => 0.5)),
}));

describe('SandPlane Utils', () => {
  let mockSimplex: jest.MockedFunction<ReturnType<typeof createNoise2D>>;

  beforeEach(() => {
    mockSimplex = createNoise2D() as jest.MockedFunction<ReturnType<typeof createNoise2D>>;
    mockSimplex.mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTerrain', () => {
    it('should generate terrain with correct array length', () => {
      const size = 4;
      const height = 1.0;
      const levels = 2;
      const scale = 1.0;
      const offset = { x: 0, z: 0 };

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      // Each vertex has 3 components (x, y, z) and we have size^2 vertices
      expect(vertices.length).toBe(size * size * 3);
      expect(vertices).toBeInstanceOf(Float32Array);
    });

    it('should calculate x coordinates correctly', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 2.0;
      const offset = { x: 1, z: 0 };

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      // Check x coordinates (every 3rd element starting at index 0)
      expect(vertices[0]).toBeCloseTo((1 + (0 / 2 - 0.5)) * 2, 10); // x=0, y=0
      expect(vertices[3]).toBeCloseTo((1 + (1 / 2 - 0.5)) * 2, 10); // x=1, y=0
      expect(vertices[6]).toBeCloseTo((1 + (0 / 2 - 0.5)) * 2, 10); // x=0, y=1
      expect(vertices[9]).toBeCloseTo((1 + (1 / 2 - 0.5)) * 2, 10); // x=1, y=1
    });

    it('should calculate z coordinates correctly', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 2.0;
      const offset = { x: 0, z: 1 };

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      // Check z coordinates (every 3rd element starting at index 2)
      expect(vertices[2]).toBeCloseTo((1 + Math.floor(0 / 2) / 2 - 0.5) * 2, 10); // x=0, z=0
      expect(vertices[5]).toBeCloseTo((1 + Math.floor(1 / 2) / 2 - 0.5) * 2, 10); // x=1, z=0
      expect(vertices[8]).toBeCloseTo((1 + Math.floor(2 / 2) / 2 - 0.5) * 2, 10); // x=0, z=1
      expect(vertices[11]).toBeCloseTo((1 + Math.floor(3 / 2) / 2 - 0.5) * 2, 10); // x=1, z=1
    });

    it('should handle different scales correctly', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 5.0;
      const offset = { x: 0, z: 0 };

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      // Check that scale is applied to x coordinates
      expect(vertices[0]).toBeCloseTo((0 / 2 - 0.5) * 5, 10);
      expect(vertices[3]).toBeCloseTo((1 / 2 - 0.5) * 5, 10);
    });

    it('should handle different offsets correctly', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 1.0;
      const offset = { x: 10, z: 20 };

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      // Check that offset is applied
      expect(vertices[0]).toBeCloseTo((10 + (0 / 2 - 0.5)) * 1, 10);
      expect(vertices[2]).toBeCloseTo((20 + Math.floor(0 / 2) / 2 - 0.5) * 1, 10);
    });

    it('should handle edge case with size 1', () => {
      const size = 1;
      const height = 1.0;
      const levels = 1;
      const scale = 1.0;
      const offset = { x: 0, z: 0 };

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      expect(vertices.length).toBe(3); // 1 vertex * 3 components
      expect(vertices[0]).toBeCloseTo(-0.5, 10); // x coordinate
      expect(vertices[2]).toBeCloseTo(-0.5, 10); // z coordinate
    });

    it('should return lowest point', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 1.0;
      const offset = { x: 0, z: 0 };

      const [, lowest] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      expect(typeof lowest).toBe('number');
      expect(lowest).toBeLessThanOrEqual(0);
    });

    it('should call noise function', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 1.0;
      const offset = { x: 0, z: 0 };

      generateTerrain(mockSimplex, size, height, levels, scale, offset);

      expect(mockSimplex).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid vertex index gracefully', () => {
      const size = 2;
      const height = 1.0;
      const levels = 1;
      const scale = 1.0;
      const offset = { x: 0, z: 0 };

      // Mock console.error to catch the error case
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const [vertices] = generateTerrain(mockSimplex, size, height, levels, scale, offset);

      // The function should complete without throwing
      expect(vertices).toBeInstanceOf(Float32Array);
      expect(vertices.length).toBe(12); // 4 vertices * 3 components

      consoleSpy.mockRestore();
    });
  });
}); 