import { useEffect, useMemo, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import {
  BufferAttribute,
  BufferGeometry,
  MeshStandardMaterial,
  TextureLoader,
} from "three";
import { useLoader } from "@react-three/fiber";

interface TerrainOffset {
  x: number;
  z: number;
}
const holeRadius = 0.3;

const generateTerrain = (
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

interface TerrainProps {
  seed?: number;
  size?: number;
  height?: number;
  levels?: number;
  scale?: number;
  offset?: TerrainOffset;
}

const Terrain = ({
  seed = 1,
  size = 64,
  height = 0.02,
  levels = 1,
  scale = 10,
  offset = { x: 0, z: 0 },
}: TerrainProps) => {
  const simplex = useMemo(() => createNoise2D(), [seed]);
  const ref = useRef<BufferGeometry>(null!);

  const sandTexture = useLoader(
    TextureLoader,
          "/assets/textures/sand_texture.jpg"
  );

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      map: sandTexture,
      roughness: 0.8,
      metalness: 0,
    });
  }, [sandTexture]);

  useEffect(() => {
    const [vertices] = generateTerrain(
      simplex,
      size,
      height,
      levels,
      scale,
      offset
    );

    ref.current.setAttribute("position", new BufferAttribute(vertices, 3));
    ref.current.computeVertexNormals();
  }, [size, height, levels, scale, offset, simplex]);

  return (
    <group
      scale={10 / scale}
      position={[-offset.x, 0, 0.1]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <mesh>
        <planeGeometry args={[1, 1, size - 1, size - 1]} ref={ref} />
        <primitive object={material} />
      </mesh>
    </group>
  );
};

export default Terrain;
