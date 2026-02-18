import React from 'react';

import { EnemyShotsGrid } from '@/bundle/components/EnemyShotsGrid';
import { GridHelper } from '@/bundle/components/GridHelper';
import { PlayerShotsGrid } from '@/bundle/components/PlayerShotsGrid';
import { HousePlane } from '@/bundle/layers';
import { RocksPlane } from '@/bundle/layers/RocksPlane';
import { SandPlane } from '@/bundle/layers/SandPlane';
import { ShipsPlane } from '@/bundle/layers/ShipsPlane';
import { TreePlane } from '@/bundle/layers/TreePlane';
import { WaterPlane } from '@/bundle/layers/WaterPlane';

import type { GameGridProps } from './GameGrid.types';

export const GameGrid: React.FC<GameGridProps> = ({
  position,
  rotation,
  isPlayerBoard = true,
  showShips = true,
  showShots = true,
}) => {

  return (
    <mesh rotation={rotation} position={position} scale={1}>
      <group>
        <WaterPlane />
        <WaterPlane size={[7, 7]} />
        <SandPlane />
        <RocksPlane />
        <TreePlane isPlayerBoard={isPlayerBoard} />
        <HousePlane isPlayerBoard={isPlayerBoard} />

        <GridHelper />

        {showShots && !isPlayerBoard && <PlayerShotsGrid />}
        {showShots && isPlayerBoard && <EnemyShotsGrid />}
        {showShips && isPlayerBoard && <ShipsPlane />}
      </group>
    </mesh>
  );
};
