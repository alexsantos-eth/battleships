export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export class MathUtils {
  static distance3D(from: Vector3, to: Vector3): number {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static distance2D(from: Vector2, to: Vector2): number {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static rotationDistance(from: Vector3, to: Vector3): number {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) + Math.abs(from.z - to.z);
  }

  static lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  static lerpVector3(from: Vector3, to: Vector3, factor: number): Vector3 {
    return {
      x: this.lerp(from.x, to.x, factor),
      y: this.lerp(from.y, to.y, factor),
      z: this.lerp(from.z, to.z, factor),
    };
  }

  static lerpVector2(from: Vector2, to: Vector2, factor: number): Vector2 {
    return {
      x: this.lerp(from.x, to.x, factor),
      y: this.lerp(from.y, to.y, factor),
    };
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static clamp01(value: number): number {
    return this.clamp(value, 0, 1);
  }

  static randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(this.randomRange(min, max + 1));
  }

  static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  static isWithinBounds(position: Vector2, width: number, height: number): boolean {
    return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height;
  }

  static isWithinBounds3D(position: Vector3, bounds: Vector3): boolean {
    return (
      position.x >= 0 && position.x < bounds.x &&
      position.y >= 0 && position.y < bounds.y &&
      position.z >= 0 && position.z < bounds.z
    );
  }

  static roundToDecimal(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  static isApproximatelyEqual(a: number, b: number, tolerance: number = 0.001): boolean {
    return Math.abs(a - b) < tolerance;
  }

  static isApproximatelyEqualVector3(a: Vector3, b: Vector3, tolerance: number = 0.001): boolean {
    return (
      this.isApproximatelyEqual(a.x, b.x, tolerance) &&
      this.isApproximatelyEqual(a.y, b.y, tolerance) &&
      this.isApproximatelyEqual(a.z, b.z, tolerance)
    );
  }
} 