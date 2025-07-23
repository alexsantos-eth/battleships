import { useState } from "react";

import { useCursor } from "@react-three/drei";

interface CellProps {
  position: [number, number, number];
  onClick: (position: [number, number, number]) => void;
}

const Cell: React.FC<CellProps> = ({ position, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useCursor(hovered);

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setClicked(true);
        onClick?.(position);
      }}
    >
      <planeGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial
        color={clicked ? "#248dc5" : "white"}
        opacity={clicked ? 1 : 0}
        transparent
        flatShading
      />
    </mesh>
  );
};

export default Cell;
