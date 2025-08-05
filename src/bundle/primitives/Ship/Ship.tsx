import { useRef } from "react";
import { Group } from "three";

import { useGameStore } from "@/bundle/stores/game/gameStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { SHIP_VARIANTS } from "./constants/variants";
import {
  calculateGroupOffset,
  calculateModelOffset,
  calculateOrientationOffset,
  calculateShipModelOffset,
  calculateShipPlaneSize,
  calculateShipPosition,
  calculateShipRotation,
  calculateShipScale,
  calculateWaveAnimation,
} from "./tools/calculations";

import type { ShipProps } from "./Ship.types";

const Ship: React.FC<ShipProps> = ({
  coords,
  variant,
  orientation = "horizontal",
}) => {
  const { boardWidth, boardHeight } = useGameStore();
  const shipConfig = SHIP_VARIANTS[variant];
  const { scene } = useGLTF(shipConfig.modelUrl);
  const clonedScene = scene.clone();

  const groupRef = useRef<Group>(null);

  const position = calculateShipPosition(
    coords,
    boardWidth,
    boardHeight,
    orientation,
    shipConfig.size,
    shipConfig.extraOffset
  );

  const rotation = calculateShipRotation(orientation);
  const scale = calculateShipScale(variant);

  const orientationOffset = calculateOrientationOffset(
    orientation,
    shipConfig.extraOffset
  );

  const modelOffset = calculateModelOffset();

  const groupOffset = calculateGroupOffset(
    shipConfig.groupOffset,
    orientation,
    shipConfig.extraOffset
  );

  const shipModelOffset = calculateShipModelOffset(
    shipConfig.shipOffset,
    orientation
  );

  const planeSizes = calculateShipPlaneSize(shipConfig.size, orientation);
  const planeSize = [planeSizes.width, planeSizes.height] as [number, number];

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const waveAnimation = calculateWaveAnimation(
        time,
        shipConfig.waveFrequency,
        shipConfig.waveAmplitude,
        coords
      );

      groupRef.current.position.y = waveAnimation.y + groupOffset.y;
      groupRef.current.position.z = waveAnimation.z + groupOffset.z;
    }
  });

  return (
    <group position={[position.x, position.y, position.z + groupOffset.z]}>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.028]} frustumCulled={false}>
        <planeGeometry args={planeSize} />
        <meshStandardMaterial
          color={shipConfig.color}
          transparent
          opacity={1}
          flatShading
        />
      </mesh>

      <group ref={groupRef}>
        <primitive
          object={clonedScene}
          position={[
            orientationOffset.x + modelOffset.x + shipModelOffset.x,
            orientationOffset.y + modelOffset.y + shipModelOffset.y,
            shipModelOffset.z,
          ]}
          scale={[scale.x, scale.y, scale.z]}
          rotation={[rotation.x, rotation.y, rotation.z]}
        />
      </group>
    </group>
  );
};

export default Ship;
