import React from "react";

import { House } from "@/bundle/primitives";

import type { HousePlaneProps, HouseConfig } from "./HousePlane.types";

const houses: HouseConfig[] = [
  {
    id: "house-1",
    position: [-3.5, 0.1, -0.8],
    rotation: [0, 0, 0],
    scale: [0.3, 0.3, 0.3],
    variant: 2,
  },
  {
    id: "house-2",
    position: [0, 0, 3.7],
    rotation: [0, -Math.PI / 2, 0],
    scale: [0.3, 0.3, 0.3],
    variant: 3,
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
