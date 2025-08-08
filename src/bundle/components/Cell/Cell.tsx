import React, { useState } from "react";

import { COLORS } from "@/config/colors/palette";
import { useCursor } from "@react-three/drei";

import type { CellProps } from "./Cell.types";
import { SHIP_VARIANTS } from "@/bundle/primitives/Ship/constants/variants";
export const Cell: React.FC<CellProps> = ({
  position,
  onClick,
  isShot = false,
  isHit = false,
  disabled = false,
  isShipCell = false,
  shipVariant,
}) => {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered && !disabled);

  const getColor = () => {
    if (isHit) {
      return COLORS.cells.hit;
    }

    if (isShipCell && shipVariant) return SHIP_VARIANTS[shipVariant].color;
    if (!isShot) return "white";

    return COLORS.cells.miss;
  };

  const getOpacity = () => {
    if (isShipCell) return 1;
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
      frustumCulled={false}
    >
      <planeGeometry args={[0.5, 0.5]} />
      <meshToonMaterial color={getColor()} opacity={getOpacity()} transparent />
    </mesh>
  );
};
