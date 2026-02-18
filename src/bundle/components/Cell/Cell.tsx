import React, {
  useRef,
  useState,
} from 'react';

import * as THREE from 'three';

import { SHIP_VARIANTS } from '@/bundle/primitives/Ship/constants/variants';
import { COLORS } from '@/config/colors/palette';
import {
  useCursor,
  useTexture,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import type { CellProps } from './Cell.types';

const Cell: React.FC<CellProps> = ({
  position,
  onClick,
  isShot = false,
  isHit = false,
  disabled = false,
  isShipCell = false,
  shipVariant,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered && !disabled);

  const getColor = () => {
    if (isHit) {
      return COLORS.cells.hit;
    }

    if (isShipCell && shipVariant) return SHIP_VARIANTS[shipVariant].color;
    if (!isShot) return "white";

    return undefined;
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

  const swirlTexture = useTexture('/assets/textures/swirl.png');
  const isMiss = isShot && !isHit && !isShipCell;

  useFrame(() => {
    if (isMiss && meshRef.current) {
      meshRef.current.rotation.z += 0.05 * (Math.log(position[0]) * 0.2);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      frustumCulled={false}
    >
      <planeGeometry args={[0.5, 0.5]} />
      {isMiss && swirlTexture ? (
        <>
          <meshBasicMaterial
            map={swirlTexture}
            opacity={0.5}
            transparent
          />
        </>
      ) : (
        <meshBasicMaterial color={getColor()} opacity={getOpacity()} transparent />
      )}
    </mesh>
  );
};


export default Cell