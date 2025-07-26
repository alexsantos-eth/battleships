import { useMemo, useRef } from "react";
import { Group } from "three";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { SHIP_VARIANTS, type ShipProps } from "./utils";
import {
  calculateShipPosition,
  calculateShipRotation,
  calculateShipPlaneSize,
  calculateWaveAnimation,
  calculateOrientationOffset,
} from "./calculations";

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

  const position = calculateShipPosition(
    coords,
    orientation,
    shipConfig.size,
    shipConfig.extraOffset
  );

  const rotation = calculateShipRotation(orientation);

  const orientationOffset = calculateOrientationOffset(
    orientation,
    shipConfig.extraOffset
  );

  const planeSize = useMemo(() => {
    const size = calculateShipPlaneSize(shipConfig.size, orientation);
    return [size.width, size.height] as [number, number];
  }, [shipConfig.size, orientation]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const waveAnimation = calculateWaveAnimation(
        time,
        shipConfig.waveFrequency,
        shipConfig.waveAmplitude,
        coords
      );

      groupRef.current.position.y = waveAnimation.y;
      groupRef.current.position.z = waveAnimation.z;
    }
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.03]}>
        <planeGeometry args={planeSize} />
        <meshStandardMaterial
          color={shipConfig.color}
          transparent
          opacity={0.5}
          flatShading
        />
      </mesh>

      <group ref={groupRef}>
        <primitive
          object={clonedScene}
          position={[orientationOffset.x, orientationOffset.y, 0]}
          scale={shipConfig.scale}
          rotation={[rotation.x, rotation.y, rotation.z]}
        />
      </group>
    </group>
  );
};

export default Ship;
