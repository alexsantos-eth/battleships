import { useMemo, useRef } from "react";
import { Group } from "three";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

useGLTF.preload("/assets/models/Ship_Small.gltf");
useGLTF.preload("/assets/models/Ship_Large.gltf");
useGLTF.preload("/assets/models/Environment_House1.gltf");
useGLTF.preload("/assets/models/Environment_House3.gltf");

interface ShipProps {
  coords: [number, number];
  variant: "small" | "large" | "house" | "house2";
  orientation?: "horizontal" | "vertical";
}

const SHIP_VARIANTS = {
  small: {
    size: 2,
    url: "/assets/models/Ship_Small.gltf",
    scale: [0.15, 0.15, 0.1] as [number, number, number],
    extraOffset: 0,
    pointLightOffset: [0, 0, 0.5] as [number, number, number],
    pointLightIntensity: 0.3,
    waveFrequency: 3.5,
    waveAmplitude: 0.02,
  },
  large: {
    size: 3,
    url: "/assets/models/Ship_Large.gltf",
    scale: [0.08, 0.08, 0.08] as [number, number, number],
    extraOffset: 0,
    pointLightOffset: [0, 0, 0.5] as [number, number, number],
    pointLightIntensity: 0.3,
    waveFrequency: 2.5,
    waveAmplitude: 0.03,
  },
  house: {
    size: 5,
    url: "/assets/models/Environment_House1.gltf",
    scale: [0.17, 0.15, 0.1] as [number, number, number],
    extraOffset: 0.2,
    pointLightOffset: [0, 0, 0.9] as [number, number, number],
    pointLightIntensity: 0.5,
    waveFrequency: 2.0,
    waveAmplitude: 0.04,
  },
  house2: {
    size: 4,
    url: "/assets/models/Environment_House3.gltf",
    scale: [0.2, 0.15, 0.12] as [number, number, number],
    extraOffset: 0.2,
    pointLightOffset: [0, 0, 0.9] as [number, number, number],
    pointLightIntensity: 0.5,
    waveFrequency: 2.0,
    waveAmplitude: 0.04,
  },
} as const;

const Ship: React.FC<ShipProps> = ({
  coords,
  variant,
  orientation = "horizontal",
}) => {
  const shipConfig = SHIP_VARIANTS[variant];
  const { scene } = useGLTF(shipConfig.url);
  const clonedScene = useMemo(() => {
    try {
      return scene.clone();
    } catch (error) {
      console.error(`Error cloning scene for ${variant}:`, error);
      return scene;
    }
  }, [scene, variant]);

  const groupRef = useRef<Group>(null);

  const spacing = 0.5;
  const posX = coords[0] * spacing - (spacing * 10) / 2 + spacing / 2;
  const posY = coords[1] * spacing - (spacing * 10) / 2 + spacing / 2;

  const rotation =
    orientation === "vertical"
      ? [-Math.PI / 2, -Math.PI / 2, Math.PI]
      : [-Math.PI / 2, 0, -Math.PI];

  const baseOffset = 0.2;
  const sizeOffset = 0.6;
  const sizeMultiplier = shipConfig.size * sizeOffset;
  const extraOffset = shipConfig.extraOffset;
  const orientationOffsetY =
    orientation === "vertical" ? baseOffset * sizeMultiplier + extraOffset : 0;
  const orientationOffsetX =
    orientation === "vertical" ? 0 : baseOffset * sizeMultiplier + extraOffset;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const frequency = shipConfig.waveFrequency;
      const amplitude = shipConfig.waveAmplitude;
      const phase = (coords[0] + coords[1]) * 0.5;

      const waveY = Math.sin(time * frequency + phase) * amplitude;
      const waveZ =
        Math.cos(time * frequency * 0.7 + phase) * (amplitude * 0.5);

      groupRef.current.position.y = posY + orientationOffsetY + waveY;
      groupRef.current.position.z = waveZ;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[posX + orientationOffsetX, posY + orientationOffsetY, 0]}
    >
      <pointLight
        color="#ffd180"
        intensity={shipConfig.pointLightIntensity}
        position={shipConfig.pointLightOffset}
        distance={2}
        decay={2}
      />

      <primitive
        object={clonedScene}
        position={[0, 0, 0.18]}
        scale={shipConfig.scale}
        rotation={rotation}
      />
    </group>
  );
};

export default Ship;
