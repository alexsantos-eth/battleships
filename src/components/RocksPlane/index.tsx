import { useMemo } from "react";
import Rock from "../Rock";

const GRID_SIZE = 10;
const GRID_SPACING = 0.5;
const GRID_BOUNDS = (GRID_SIZE * GRID_SPACING) / 2; // Half the grid size (2.5)

const ROCK_AREA_MIN = -4;
const ROCK_AREA_MAX = 4;
const NUM_ROCKS = 25; 

function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomRockVariant(): 1 | 2 | 3 | 4 | 5 {
  return (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
}

function isInGridArea(x: number, y: number): boolean {
  const buffer = 0.2;
  return Math.abs(x) <= (GRID_BOUNDS + buffer) && Math.abs(y) <= (GRID_BOUNDS + buffer);
}

function generateRandomRocks() {
  const rocks = [];
  
  for (let i = 0; i < NUM_ROCKS; i++) {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;
    
 
    do {
      x = getRandomFloat(ROCK_AREA_MIN, ROCK_AREA_MAX);
      y = getRandomFloat(ROCK_AREA_MIN, ROCK_AREA_MAX);
      attempts++;
    } while (isInGridArea(x, y) && attempts < maxAttempts);
    
    if (isInGridArea(x, y)) {
      if (Math.abs(x) <= (GRID_BOUNDS + 0.2)) {
        x = x >= 0 ? GRID_BOUNDS + 0.5 : -GRID_BOUNDS - 0.5;
      }
      if (Math.abs(y) <= (GRID_BOUNDS + 0.2)) {
        y = y >= 0 ? GRID_BOUNDS + 0.5 : -GRID_BOUNDS - 0.5;
      }
    }
    
    const variant = getRandomRockVariant();
    const rotation: [number, number, number] = [
      getRandomFloat(0, Math.PI * 2),
      getRandomFloat(0, Math.PI * 2),
      getRandomFloat(0, Math.PI * 2),
    ];
    const scale = getRandomFloat(0.3, 0.8);
    
    rocks.push({
      id: i,
      variant,
      position: [x, y, 0.15] as [number, number, number], 
      rotation,
      scale: [scale, scale, scale] as [number, number, number],
    });
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
          scale={rock.scale}
        />
      ))}
    </group>
  );
};

export default RocksPlane;
