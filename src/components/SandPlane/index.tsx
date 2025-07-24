/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { BufferAttribute, BufferGeometry, MeshStandardMaterial } from "three";

import { generateTerrain } from "./utils";

interface TerrainOffset {
  x: number;
  z: number;
}

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
  scale = 5,
  offset = { x: 0, z: 0 },
}: TerrainProps) => {
  const simplex = useMemo(() => createNoise2D(), [seed]);
  const ref = useRef<BufferGeometry>(null!);

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: 0xf4d03f,
      roughness: 0.8,
      metalness: 0,
    });
  }, []);

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
