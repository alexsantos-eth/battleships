import { useState } from "react";

import { useCursor } from "@react-three/drei";

interface CellProps {
  position: [number, number, number];
  onClick: (position: [number, number, number]) => void;
  isShot?: boolean;
  isHit?: boolean;
}

const Cell: React.FC<CellProps> = ({ position, onClick, isShot = false, isHit = false }) => {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  const getColor = () => {
    if (!isShot) return "white";
    return isHit ? "#ff4444" : "#248dc5";
  };

  const getOpacity = () => {
    if (isShot) return 1;
    return hovered ? 0.3 : 0;
  };

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        if (!isShot) {
          onClick?.(position);
        }
      }}
    >
      <planeGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial
        color={getColor()}
        opacity={getOpacity()}
        transparent
        flatShading
      />
    </mesh>
  );
};

export default Cell;
