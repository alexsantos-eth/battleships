import { useRef } from "react";
import { Group } from "three";

import WaterProjection from "@/bundle/components/WaterProjection/WaterProjection";
import { useGameStore } from "@/bundle/stores/game/gameStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { SHIP_VARIANTS } from "./constants/variants";
import {
  calculateGroupOffset,
  calculateModelOffset,
  calculateOrientationOffset,
  calculateShipModelOffset,
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

  const projectionRadius =
    0.1 * shipConfig.size + shipConfig.projectionOffset.x;

  return (
    <group position={[position.x, position.y, position.z + groupOffset.z]}>
      <WaterProjection
        shipConfig={shipConfig}
        color={shipConfig.color}
        orientation={orientation}
        projectionRadius={projectionRadius}
      />

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
