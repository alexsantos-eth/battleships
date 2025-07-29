import { MathUtils, type Vector2, type Vector3 } from "../math";

describe("MathUtils", () => {
  describe("Distance Calculations", () => {
    test("should calculate 3D distance correctly", () => {
      const from: Vector3 = { x: 0, y: 0, z: 0 };
      const to: Vector3 = { x: 3, y: 4, z: 0 };
      const distance = MathUtils.distance3D(from, to);
      expect(distance).toBe(5);
    });

    test("should calculate 2D distance correctly", () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 3, y: 4 };
      const distance = MathUtils.distance2D(from, to);
      expect(distance).toBe(5);
    });

    test("should return 0 for same points", () => {
      const point: Vector3 = { x: 1, y: 2, z: 3 };
      const distance = MathUtils.distance3D(point, point);
      expect(distance).toBe(0);
    });

    test("should handle negative coordinates", () => {
      const from: Vector3 = { x: -1, y: -2, z: -3 };
      const to: Vector3 = { x: 2, y: 4, z: 6 };
      const distance = MathUtils.distance3D(from, to);
      expect(distance).toBeCloseTo(11.225, 3);
    });
  });

  describe("Rotation Distance", () => {
    test("should calculate rotation distance correctly", () => {
      const from: Vector3 = { x: 0, y: 0, z: 0 };
      const to: Vector3 = { x: 1, y: 2, z: 3 };
      const distance = MathUtils.rotationDistance(from, to);
      expect(distance).toBe(6);
    });

    test("should handle negative rotations", () => {
      const from: Vector3 = { x: 1, y: 2, z: 3 };
      const to: Vector3 = { x: -1, y: -2, z: -3 };
      const distance = MathUtils.rotationDistance(from, to);
      expect(distance).toBe(12);
    });
  });

  describe("Linear Interpolation (Lerp)", () => {
    test("should interpolate between two numbers", () => {
      const result = MathUtils.lerp(0, 10, 0.5);
      expect(result).toBe(5);
    });

    test("should return start value at factor 0", () => {
      const result = MathUtils.lerp(5, 15, 0);
      expect(result).toBe(5);
    });

    test("should return end value at factor 1", () => {
      const result = MathUtils.lerp(5, 15, 1);
      expect(result).toBe(15);
    });

    test("should handle negative values", () => {
      const result = MathUtils.lerp(-10, 10, 0.5);
      expect(result).toBe(0);
    });

    test("should interpolate Vector3 correctly", () => {
      const from: Vector3 = { x: 0, y: 0, z: 0 };
      const to: Vector3 = { x: 10, y: 20, z: 30 };
      const result = MathUtils.lerpVector3(from, to, 0.5);
      expect(result).toEqual({ x: 5, y: 10, z: 15 });
    });

    test("should interpolate Vector2 correctly", () => {
      const from: Vector2 = { x: 0, y: 0 };
      const to: Vector2 = { x: 10, y: 20 };
      const result = MathUtils.lerpVector2(from, to, 0.5);
      expect(result).toEqual({ x: 5, y: 10 });
    });
  });

  describe("Clamping", () => {
    test("should clamp value within range", () => {
      expect(MathUtils.clamp(5, 0, 10)).toBe(5);
      expect(MathUtils.clamp(-5, 0, 10)).toBe(0);
      expect(MathUtils.clamp(15, 0, 10)).toBe(10);
    });

    test("should clamp to 0-1 range", () => {
      expect(MathUtils.clamp01(0.5)).toBe(0.5);
      expect(MathUtils.clamp01(-0.5)).toBe(0);
      expect(MathUtils.clamp01(1.5)).toBe(1);
    });
  });

  describe("Random Functions", () => {
    test("should generate random range", () => {
      const result = MathUtils.randomRange(0, 10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10);
    });

    test("should generate random integer", () => {
      const result = MathUtils.randomInt(0, 10);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });

    test("should select random choice from array", () => {
      const array = [1, 2, 3, 4, 5];
      const result = MathUtils.randomChoice(array);
      expect(array).toContain(result);
    });

    test("should return boolean", () => {
      const result = MathUtils.randomBoolean();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("Angle Conversions", () => {
    test("should convert degrees to radians", () => {
      expect(MathUtils.degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
      expect(MathUtils.degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 5);
      expect(MathUtils.degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 5);
    });

    test("should convert radians to degrees", () => {
      expect(MathUtils.radiansToDegrees(Math.PI)).toBeCloseTo(180, 5);
      expect(MathUtils.radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 5);
      expect(MathUtils.radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 5);
    });
  });

  describe("Bounds Checking", () => {
    test("should check if position is within 2D bounds", () => {
      const position: Vector2 = { x: 5, y: 5 };
      expect(MathUtils.isWithinBounds(position, 10, 10)).toBe(true);
      expect(MathUtils.isWithinBounds(position, 3, 3)).toBe(false);
      expect(MathUtils.isWithinBounds({ x: 0, y: 0 }, 10, 10)).toBe(true);
      expect(MathUtils.isWithinBounds({ x: 9, y: 9 }, 10, 10)).toBe(true);
      expect(MathUtils.isWithinBounds({ x: 10, y: 10 }, 10, 10)).toBe(false);
    });

    test("should check if position is within 3D bounds", () => {
      const position: Vector3 = { x: 5, y: 5, z: 5 };
      const bounds: Vector3 = { x: 10, y: 10, z: 10 };
      expect(MathUtils.isWithinBounds3D(position, bounds)).toBe(true);
      expect(MathUtils.isWithinBounds3D({ x: 15, y: 5, z: 5 }, bounds)).toBe(false);
    });
  });

  describe("Rounding", () => {
    test("should round to specified decimal places", () => {
      expect(MathUtils.roundToDecimal(3.14159, 2)).toBe(3.14);
      expect(MathUtils.roundToDecimal(3.14159, 0)).toBe(3);
      expect(MathUtils.roundToDecimal(3.14159, 4)).toBe(3.1416);
    });
  });

  describe("Approximate Equality", () => {
    test("should check if numbers are approximately equal", () => {
      expect(MathUtils.isApproximatelyEqual(1.0, 1.001, 0.01)).toBe(true);
      expect(MathUtils.isApproximatelyEqual(1.0, 1.1, 0.01)).toBe(false);
      expect(MathUtils.isApproximatelyEqual(1.0, 1.0)).toBe(true);
    });

    test("should check if Vector3 are approximately equal", () => {
      const a: Vector3 = { x: 1.0, y: 2.0, z: 3.0 };
      const b: Vector3 = { x: 1.001, y: 2.001, z: 3.001 };
      const c: Vector3 = { x: 1.1, y: 2.1, z: 3.1 };
      
      expect(MathUtils.isApproximatelyEqualVector3(a, b, 0.01)).toBe(true);
      expect(MathUtils.isApproximatelyEqualVector3(a, c, 0.01)).toBe(false);
      expect(MathUtils.isApproximatelyEqualVector3(a, a)).toBe(true);
    });
  });
}); 