import { useState } from "react";

import Cell from "../Cell";
import WaterExplosion from "../WaterExplosion";

interface Explosion {
  id: number;
  pos: [number, number, number];
}

const PressGrid: React.FC = () => {
  const spacing = 0.5;
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  const handleClick = (pos: [number, number, number]) => {
    const id = Date.now();
    setExplosions((prev) => [...prev, { id, pos }]);
  };

  const cells = [];
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const posX = x * spacing - (spacing * 10) / 2 + spacing / 2;
      const posY = y * spacing - (spacing * 10) / 2 + spacing / 2;

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={[posX, posY, 0]}
          onClick={() => handleClick([posX, posY, 0.15])}
        />
      );
    }
  }

  return (
    <>
      <group rotation={[0, 0, 0]} position={[0, 0, 0.2]}>
        {cells}
      </group>

      <group rotation={[0, 0, 0]}>
        {explosions.map(({ id, pos }) => (
          <WaterExplosion
            key={id}
            position={[pos[0], pos[1]]}
            onDone={() =>
              setExplosions((prev) => prev.filter((e) => e.id !== id))
            }
          />
        ))}
      </group>
    </>
  );
};

export default PressGrid;
