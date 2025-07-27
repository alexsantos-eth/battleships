import React, { useState } from "react";
import { useCursor } from "@react-three/drei";
import type { CellProps } from './Cell.types';
import { COLORS } from "@/config/colors";

export const Cell: React.FC<CellProps> = ({
  position,
  onClick,
  isShot = false,
  isHit = false,
  disabled = false,
}) => {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered && !disabled);

  const getColor = () => {
    if (!isShot) return "white";
    return isHit ? COLORS.cells.hit : COLORS.cells.miss;
  };

  const getOpacity = () => {
    if (isShot) return 1;
    return hovered && !disabled ? 0.3 : 0;
  };

  const handleClick = () => {
    if (!isShot && !disabled) {
      onClick?.(position);
    }
  };

  const handlePointerOver = () => {
    if (!disabled) {
      setHovered(true);
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  return (
    <mesh
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
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