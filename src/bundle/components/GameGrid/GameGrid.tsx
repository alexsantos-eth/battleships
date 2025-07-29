import React from 'react';

import { EnemyShotsGrid } from '@/bundle/components/EnemyShotsGrid';
import { GridHelper } from '@/bundle/components/GridHelper';
import { PlayerShotsGrid } from '@/bundle/components/PlayerShotsGrid';
import { PressGrid } from '@/bundle/components/PressGrid';
import { useGridDimensions } from '@/bundle/hooks/grid/useGridDimensions';
import { RocksPlane } from '@/bundle/layers/RocksPlane';
import { SandPlane } from '@/bundle/layers/SandPlane';
import { ShipsPlane } from '@/bundle/layers/ShipsPlane';
import { TreePlane } from '@/bundle/layers/TreePlane';
import { WaterPlane } from '@/bundle/layers/WaterPlane';
import { useGameStore } from '@/bundle/stores/game/gameStore';

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