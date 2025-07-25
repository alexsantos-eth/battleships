import { useEffect, useMemo, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { useLoader } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector3,
  TextureLoader,
  RepeatWrapping,
} from "three";

import { generateTerrain } from "./utils";
import { getTerrainColor } from "../../config/colors";

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
    return new ShaderMaterial({
      uniforms: {
        sandColor: { value: new Vector3(...getTerrainColor('sand')) }, 
        grassColor: { value: new Vector3(...getTerrainColor('grass')) }, 
        transitionDistance: { value: 0.42 },
        transitionWidth: { value: 0.2 },
        noiseSeed: { value: Math.random() * 1000.0 },
        smoothness: { value: 1.0 }, 
        sandTexture: { value: sandTexture },
        grassTexture: { value: grassTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sandColor;
        uniform vec3 grassColor;
        uniform float transitionDistance;
        uniform float transitionWidth;
        uniform float noiseSeed;
        uniform float smoothness;
        uniform sampler2D sandTexture;
        uniform sampler2D grassTexture;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        float noise(vec2 p) {
          return fract(sin(dot(p + noiseSeed, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        float angularNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          
          float fx = pow(f.x, smoothness);
          float fy = pow(f.y, smoothness);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, fx), mix(c, d, fx), fy);
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float baseDistance = length(vUv - center);
          
          float noiseValue = angularNoise(vUv * 8.0) * 0.1; 
          float organicDistance = baseDistance + noiseValue;
          
          float t = step(transitionDistance, organicDistance);
          
   
          vec4 sandTex = texture2D(sandTexture, vUv * 6.0);
          vec3 texturedSandColor = sandColor * sandTex.rgb;
          
          vec4 grassTex = texture2D(grassTexture, vUv * 6.0);
          vec3 texturedGrassColor = grassColor * grassTex.rgb;
          
          vec3 finalColor = mix(texturedSandColor, texturedGrassColor, t);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [sandTexture, grassTexture]);

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
      scale={11 / scale}
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
