import React from "react";
import { Rock } from "@/components/primitives/Rock";
import type { RocksPlaneProps, RockConfig } from './RocksPlane.types';

const rocks: RockConfig[] = [
  {
    id: "rock-left-1",
    variant: 6,
    position: [-3.5, 0, 0.1],
    rotation: [Math.PI / 2, Math.PI / 4, 0],
  },
  {
    id: "rock-left-2",
    variant: 2,
    position: [-3, -0.8, 0.2],
    rotation: [Math.PI / 2, Math.PI / 4, 0],
  },
  {
    id: "rock-left-3",
    variant: 2,
    position: [-3, -1.4, -0.1],
    rotation: [Math.PI / 2, -Math.PI / 2, 1],
  },
  {
    id: "rock-left-4",
    variant: 7,
    position: [-2.7, -2.6, 0.5],
    rotation: [Math.PI / 2, Math.PI / 4, 2],
  },
  {
    id: "rock-bottom-1",
    variant: 6,
    position: [-1.7, -3, -0.55],
    rotation: [Math.PI / 2, Math.PI / 3, 0],
  },
  {
    id: "rock-bottom-2",
    variant: 7,
    position: [1.1, -3.3, -0.25],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "rock-bottom-3",
    variant: 4,
    position: [2, -3.1, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "rock-right-1",
    variant: 7,
    position: [3.5, -1, 0],
    rotation: [Math.PI / 2, Math.PI / 2, 0],
  },
  {
    id: "rock-right-2",
    variant: 4,
    position: [3.5, 0.5, 0.2],
    rotation: [Math.PI / 2, -Math.PI / 2, 0],
  },
  {
    id: "rock-right-3",
    variant: 3,
    position: [3.2, 1, -0.1],
    rotation: [Math.PI / 2, -Math.PI / 2, 0],
  },
];

export const RocksPlane: React.FC<RocksPlaneProps> = () => {
  return (
    <group>
      {rocks.map((rock) => (
        <Rock
          key={rock.id}
          variant={rock.variant}
          position={rock.position}
          rotation={rock.rotation}
        />
      ))}
    </group>
  );
}; 