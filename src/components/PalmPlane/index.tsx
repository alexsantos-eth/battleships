import { useMemo } from "react";

import { placementManager } from "../../utils/placementManager";
import PalmTree from "../PalmTree";

const GRID_SIZE = 2;
const MAX_PALM_TREES = 5;
const PALM_TREE_RADIUS = 50;

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPalmTrees() {
  const palmTrees: Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    variant: 1 | 2 | 3;
  }> = [];

  placementManager.clearCategory("palmTrees");

  for (let i = 0; i < MAX_PALM_TREES; i++) {
    let attempts = 0;
    const maxAttempts = 50;
    let position: [number, number, number] | null = null;

    do {
      const side = getRandomInt(0, 1);
      let x: number, z: number;

      switch (side) {
        case 0:
          x = getRandomInt(-GRID_SIZE - 2, GRID_SIZE + 2);
          z = getRandomInt(GRID_SIZE + 1, GRID_SIZE + 3);
          break;
        case 1:
          x = getRandomInt(-GRID_SIZE - 2, GRID_SIZE + 2);
          z = getRandomInt(-GRID_SIZE - 3, -GRID_SIZE - 1);
          break;
        default:
          x = 0;
          z = 0;
      }

      position = [x, 0, z];

      attempts++;
    } while (
      attempts < maxAttempts &&
      !placementManager.canPlace(position, PALM_TREE_RADIUS, "palmTrees")
    );

    if (position) {
      placementManager.place(position, PALM_TREE_RADIUS, "palmTrees");

      const variant = getRandomInt(1, 3) as 1 | 2 | 3;
      const scale = getRandomInt(8, 12) / 10;
      const rotationY = (getRandomInt(0, 360) * Math.PI) / 180;

      palmTrees.push({
        position,
        rotation: [0, rotationY, 0],
        scale: [scale, scale, scale],
        variant,
      });
    }
  }

  return palmTrees;
}

const PalmPlane = () => {
  const palmTrees = useMemo(() => getRandomPalmTrees(), []);

  return (
    <group rotation={[Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 0.1]}>
      {palmTrees.map((palmTree, idx) => (
        <PalmTree
          key={idx}
          position={palmTree.position}
          rotation={palmTree.rotation}
          variant={palmTree.variant}
        />
      ))}
    </group>
  );
};

export default PalmPlane;
