import React from 'react';
import { GridHelper } from "@/components/features/GridHelper";
import { PressGrid } from "@/components/features/PressGrid";
import { PlayerShotsGrid } from "@/components/features/PlayerShotsGrid";
import { EnemyShotsGrid } from "@/components/features/EnemyShotsGrid";
import { RocksPlane } from "@/components/layers/RocksPlane";
import { SandPlane } from "@/components/layers/SandPlane";
import { ShipsPlane } from "@/components/features/ShipsPlane";
import { TreePlane } from "@/components/layers/TreePlane";
import { WaterPlane } from "@/components/layers/WaterPlane";
import { useGameStore } from "@/stores/game";
import { useGridDimensions } from "@/hooks/useGridDimensions";
import type { GameGridProps } from './GameGrid.types';

export const GameGrid: React.FC<GameGridProps> = ({
  position,
  rotation,
  enablePressGrid,
  isPlayerBoard = true,
  showShips = true,
  showShots = true,
  alwaysShowEnemyShips = false,
}) => {
  const { isPlayerTurn } = useGameStore();
  const { calculateTotalGridWidth, calculateTotalGridHeight } = useGridDimensions();
  
  const gridWidth = calculateTotalGridWidth();
  const gridHeight = calculateTotalGridHeight();
  const planeSize = Math.max(gridWidth, gridHeight, 5);

  return (
    <mesh rotation={rotation} position={position}>
      <planeGeometry args={[planeSize, planeSize, 10, 10]} />
      <meshStandardMaterial color="lightblue" wireframe={false} />

      <group>
        <WaterPlane />
        <SandPlane />
        <RocksPlane />
        <TreePlane />

        <GridHelper />
        {enablePressGrid && isPlayerTurn && !isPlayerBoard && <PressGrid />}
        {showShots && !isPlayerBoard && <PlayerShotsGrid />}
        {showShots && isPlayerBoard && <EnemyShotsGrid />}
        {showShips && <ShipsPlane isPlayerBoard={isPlayerBoard} alwaysShowEnemyShips={alwaysShowEnemyShips} />}
      </group>
    </mesh>
  );
}; 