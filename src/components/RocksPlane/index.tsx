import { useMemo } from "react";

import { placementManager } from "../../utils/placementManager";
import Rock from "../Rock";

const GRID_SIZE = 10;
const GRID_SPACING = 0.5;
const GRID_BOUNDS = (GRID_SIZE * GRID_SPACING) / 2;

const NUM_ROCKS = 10;
const MIN_ROCK_DISTANCE = 1;

function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomRockVariant(): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
  const cliffVariants = [
    6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9,
  ];
  const rockVariants = [1, 2, 3, 4, 5];

  const allVariants = [...cliffVariants, ...rockVariants];
  return allVariants[Math.floor(Math.random() * allVariants.length)] as
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9;
}

function generateRandomRocks() {
  placementManager.clear();
  const rocks = [];

  for (let i = 0; i < NUM_ROCKS; i++) {
    let x, y;
    let attempts = 0;
    const maxAttempts = 200;

    const side = Math.random() < 0.5 ? 0 : 1;

    do {
      if (side === 0) {
        x = getRandomFloat(GRID_BOUNDS + 0.5, GRID_BOUNDS + 2);
        y = getRandomFloat(-GRID_BOUNDS - 1, GRID_BOUNDS + 1);
      } else {
        x = getRandomFloat(-GRID_BOUNDS - 2, -GRID_BOUNDS - 0.5);
        y = getRandomFloat(-GRID_BOUNDS - 1, GRID_BOUNDS + 1);
      }
      attempts++;
    } while (
      placementManager.hasOverlap(x, y, MIN_ROCK_DISTANCE) &&
      attempts < maxAttempts
    );

    const variant = getRandomRockVariant();
    const rotation: [number, number, number] = [
      getRandomFloat(0, Math.PI * 2),
      getRandomFloat(0, Math.PI * 2),
      getRandomFloat(0, Math.PI * 2),
    ];

    const rockData = {
      id: `rock-${i}`,
      variant,
      position: [x, y, 0.15] as [number, number, number],
      rotation,
    };

    rocks.push(rockData);

    placementManager.addObject(
      rockData.id,
      "rock",
      rockData.position,
      MIN_ROCK_DISTANCE
    );
  }

  return rocks;
}

const RocksPlane = () => {
  const rocks = useMemo(() => generateRandomRocks(), []);

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

export default RocksPlane;
