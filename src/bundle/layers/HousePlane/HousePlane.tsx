import React from "react";

import { House } from "@/bundle/primitives";

import type { HousePlaneProps, HouseConfig } from "./HousePlane.types";

const houses: HouseConfig[] = [
  {
    id: "house-bottom-1",
    position: [-3.9, 0, -0.4],
    rotation: [0, -0.1, 0],
    scale: [0.3, 0.3, 0.3],
    variant: 3,
  },
  {
    id: "house-right-1",
    position: [-0.8, 0, 3.55],
    rotation: [0, Math.PI / 2.2, 0],
    scale: [0.3, 0.3, 0.3],
    variant: 1,
  },
  {
    id: "house-right-2",
    position: [0.5, 0, 3.7],
    rotation: [0, Math.PI / 1.8, 0],
    scale: [0.3, 0.3, 0.3],
    variant: 2,
  },
  {
    id: "house-top-1",
    position: [3.5, 0, -2],
    rotation: [0, Math.PI * 2.1, 0],
    scale: [0.3, 0.3, 0.3],
    variant: 4,
  },
];

export const HousePlane: React.FC<HousePlaneProps> = () => {
  return (
    <group rotation={[Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 0.1]}>
      {houses.map((house) => (
        <House
          key={house.id}
          position={house.position}
          rotation={house.rotation}
          scale={house.scale}
          variant={house.variant}
        />
      ))}
    </group>
  );
};
