import { useMemo, useRef } from "react";
import { Group } from "three";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { SHIP_VARIANTS, type ShipProps } from "./utils";

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
  const posX =
    coords[0] * spacing -
    (spacing * 10) / 2 +
    (orientation === "vertical"
      ? spacing / 2
      : (spacing * shipConfig.size) / 2);
  const posY =
    coords[1] * spacing -
    (spacing * 10) / 2 +
    (orientation === "vertical"
      ? (spacing * shipConfig.size) / 2
      : spacing / 2);

  const rotation =
    orientation === "vertical"
      ? [-Math.PI / 2, -Math.PI / 2, Math.PI]
      : [-Math.PI / 2, 0, -Math.PI];

  const extraOffset = shipConfig.extraOffset;
  const orientationOffsetY =
    orientation === "vertical" ? -0.1 + extraOffset : 0;
  const orientationOffsetX =
    orientation === "vertical" ? 0 : -0.1 + extraOffset;

  const planeSize = useMemo(() => {
    const shipSize = shipConfig.size;
    const gridSize = shipSize * spacing;

    if (orientation === "horizontal") {
      return [gridSize, spacing] as [number, number];
    } else {
      return [spacing, gridSize] as [number, number];
    }
  }, [shipConfig.size, orientation, spacing]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const frequency = shipConfig.waveFrequency;
      const amplitude = shipConfig.waveAmplitude;
      const phase = (coords[0] + coords[1]) * 0.5;

      const waveY = Math.sin(time * frequency + phase) * amplitude;
      const waveZ =
        Math.cos(time * frequency * 0.7 + phase) * (amplitude * 0.5);

      groupRef.current.position.y = waveY;
      groupRef.current.position.z = waveZ;
    }
  });

  return (
    <group position={[posX, posY, 0.18]}>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.03]}>
        <planeGeometry args={planeSize} />
        <meshStandardMaterial
          color={shipConfig.color}
          transparent
          opacity={0.8}
          flatShading
        />
      </mesh>

      <group ref={groupRef}>
        <primitive
          object={clonedScene}
          position={[orientationOffsetX, orientationOffsetY, 0]}
          scale={shipConfig.scale}
          rotation={rotation}
        />
      </group>
    </group>
  );
};

export default Ship;
