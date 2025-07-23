import { useMemo, useRef } from "react";
import { Group } from "three";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface ShipProps {
  coords: [number, number];
  variant: "small" | "large";
  orientation?: "horizontal" | "vertical";
}

const SHIP_VARIANTS = {
  small: {
    size: 2,
          url: "/assets/models/Ship_Small.gltf",
    scale: [0.15, 0.15, 0.15] as [number, number, number],
  },
  large: {
    size: 3,
          url: "/assets/models/Ship_Large.gltf",
    scale: [0.08, 0.08, 0.08] as [number, number, number],
  },
} as const;

const Ship: React.FC<ShipProps> = ({
  coords,
  variant,
  orientation = "horizontal",
}) => {
  const shipConfig = SHIP_VARIANTS[variant];
  const { scene } = useGLTF(shipConfig.url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
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
  const orientationOffsetY =
    orientation === "vertical" ? baseOffset * sizeMultiplier : 0;
  const orientationOffsetX =
    orientation === "vertical" ? 0 : baseOffset * sizeMultiplier;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const frequency = variant === "large" ? 2.5 : 3.5;
      const amplitude = variant === "large" ? 0.03 : 0.02;
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
        intensity={0.3}
        position={[0, 0, 0.5]}
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
