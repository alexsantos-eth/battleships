import Cell from "../Cell";

const PressGrid = () => {
  const spacing = 0.5;
  const cells = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const posX = x * spacing - (spacing * 10) / 2 + spacing / 2;
      const posY = y * spacing - (spacing * 10) / 2 + spacing / 2;

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={[posX, posY, 0]}
          onClick={(pos) => console.log("Clicked:", pos)}
        />
      );
    }
  }

  return (
    <group rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.2]}>
      {cells}
    </group>
  );
};

export default PressGrid;
