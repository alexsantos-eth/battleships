import { createNoise2D } from "simplex-noise";

interface TerrainOffset {
  x: number;
  z: number;
}
const holeRadius = 0.28;

export const generateTerrain = (
  simplex: ReturnType<typeof createNoise2D>,
  size: number,
  height: number,
  levels: number,
  scale: number,
  offset: TerrainOffset
): [Float32Array, number] => {
  const noise = (level: number, x: number, z: number): number =>
    simplex(
      offset.x * scale + level * x * scale,
      offset.z * scale + level * z * scale
    ) /
      level +
    (level > 1 ? noise(level / 2, x, z) : 0);
  let lowest = 0;
  return [
    Float32Array.from({ length: size ** 2 * 3 }, (_, i) => {
      let v: number;
      switch (i % 3) {
        case 0:
          v = i / 3;
          return (offset.x + ((v % size) / size - 0.5)) * scale;
        case 1: {
          v = (i - 1) / 3;
          const x = (v % size) / size - 0.5;
          const z = Math.floor(v / size) / size - 0.5;

          const distanceFromCenter = Math.sqrt(x * x + z * z);

          let y;
          if (distanceFromCenter < holeRadius) {
            y = -0.1;
          } else {
            y = noise(2 ** levels, x, z) * height;

            const falloff = Math.max(
              0,
              (distanceFromCenter - holeRadius) / 0.05
            );
            y = y * falloff - 0.1 * (1 - falloff);
          }

          lowest = Math.min(lowest, y);
          return y;
        }
        case 2:
          v = (i - 2) / 3;
          return (offset.z + Math.floor(v / size) / size - 0.5) * scale;
        default:
          console.error("Can't happen");
          return 0;
      }
    }),
    lowest - 0.1,
  ];
};
