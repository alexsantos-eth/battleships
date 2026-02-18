import React, { useEffect, useMemo, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import {
  BufferAttribute,
  BufferGeometry,
  RepeatWrapping,
  TextureLoader,
  MeshStandardNodeMaterial,
} from "three/webgpu";
import { 
  texture,
  uv,
  vec3,
  mix,
  step,
  length,
  add,
  mul,
  floor,
  fract,
  sin,
  dot,
  pow,
  uniform,
} from "three/tsl";

import { getTerrainColor } from "@/config/colors/palette";
import { GAME_CONSTANTS } from "@/constants/game/board";
import { useLoader } from "@react-three/fiber";

import { generateTerrain } from "./tools/terrain";

import type { SandPlaneProps } from "./SandPlane.types";
export const SandPlane: React.FC<SandPlaneProps> = ({
  size = GAME_CONSTANTS.TERRAIN.GRASS.SIZE,
  height = GAME_CONSTANTS.TERRAIN.SAND.DEFAULT_HEIGHT,
  levels = GAME_CONSTANTS.TERRAIN.SAND.DEFAULT_LEVELS,
  scale = GAME_CONSTANTS.TERRAIN.SAND.DEFAULT_SCALE,
  offset = GAME_CONSTANTS.TERRAIN.SAND.DEFAULT_OFFSET,
}) => {
  const simplex = useMemo(() => createNoise2D(), []);
  const ref = useRef<BufferGeometry>(null!);

  const sandTexture = useLoader(
    TextureLoader,
    "/assets/textures/low_texture.jpg"
  );

  const grassTexture = useLoader(
    TextureLoader,
    "/assets/textures/low_texture.jpg"
  );

  sandTexture.wrapS = RepeatWrapping;
  sandTexture.wrapT = RepeatWrapping;
  grassTexture.wrapS = RepeatWrapping;
  grassTexture.wrapT = RepeatWrapping;

  const material = useMemo(() => {
    // Crear uniformes
    const noiseSeedUniform = uniform(Math.random() * 1000.0);
    const smoothnessUniform = uniform(1.0);
    const transitionDistanceUniform = uniform(GAME_CONSTANTS.TERRAIN.SAND.TRANSITION_DISTANCE);
    
    const sandColorVec = getTerrainColor("sand");
    const grassColorVec = getTerrainColor("grass");
    const sandColorNode = vec3(sandColorVec[0], sandColorVec[1], sandColorVec[2]);
    const grassColorNode = vec3(grassColorVec[0], grassColorVec[1], grassColorVec[2]);
    
    // Obtener el uv
    const uvNode = uv();
    
    // Función de ruido simplificada usando TSL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const noise = (p: any) => {
      const sinValue = sin(dot(add(p, vec3(noiseSeedUniform, noiseSeedUniform, 0)), vec3(12.9898, 78.233, 0)));
      return fract(mul(sinValue, 43758.5453));
    };
    
    // Función de ruido angular
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const angularNoise = (p: any) => {
      const i = floor(p);
      const f = fract(p);
      
      const fx = pow(f.x, smoothnessUniform);
      const fy = pow(f.y, smoothnessUniform);
      
      const a = noise(vec3(i.x, i.y, 0));
      const b = noise(vec3(add(i.x, 1.0), i.y, 0));
      const c = noise(vec3(i.x, add(i.y, 1.0), 0));
      const d = noise(vec3(add(i.x, 1.0), add(i.y, 1.0), 0));
      
      return mix(mix(a, b, fx), mix(c, d, fx), fy);
    };
    
    // Calcular distancia desde el centro
    const center = vec3(0.5, 0.5, 0);
    const baseDistance = length(uvNode.xy.sub(center.xy));
    
    // Agregar ruido
    const noiseValue = mul(angularNoise(vec3(mul(uvNode.x, 8.0), mul(uvNode.y, 8.0), 0)), 0.1);
    const organicDistance = add(baseDistance, noiseValue);
    
    // Calcular transición
    const t = step(transitionDistanceUniform, organicDistance);
    
    // Cargar texturas
    const sandTexNode = texture(sandTexture, mul(uvNode, 3.3));
    const grassTexNode = texture(grassTexture, mul(uvNode, 3.3));
    
    // Mezclar colores con texturas
    const texturedSandColor = mul(sandColorNode, sandTexNode.rgb);
    const texturedGrassColor = mul(grassColorNode, grassTexNode.rgb);
    
    // Color final
    const finalColor = mix(texturedSandColor, texturedGrassColor, t);
    
    // Crear material
    const mat = new MeshStandardNodeMaterial();
    mat.colorNode = finalColor;
    
    return mat;
  }, [sandTexture, grassTexture]);

  useEffect(() => {
    if (ref.current) {
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
    }
  }, [size, height, levels, scale, offset, simplex]);

  return (
    <>
      <group>
        <group
          scale={[
            GAME_CONSTANTS.TERRAIN.SAND.GROUP_SCALE / scale,
            GAME_CONSTANTS.TERRAIN.SAND.GROUP_SCALE / scale,
            GAME_CONSTANTS.TERRAIN.SAND.GROUP_SCALE / scale,
          ]}
          position={[
            -offset.x,
            0,
            GAME_CONSTANTS.TERRAIN.SAND.GROUP_POSITION_Y,
          ]}
          rotation={[GAME_CONSTANTS.TERRAIN.SAND.GROUP_ROTATION, 0, 0]}
        >
          <mesh frustumCulled={false} receiveShadow>
            <planeGeometry args={[1, 1, size - 1, size - 1]} ref={ref} />
            <primitive object={material} />
          </mesh>
        </group>
      </group>
    </>
  );
};
