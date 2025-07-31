import React from "react";

import { EnemyShotsGrid } from "@/bundle/components/EnemyShotsGrid";
import { GridHelper } from "@/bundle/components/GridHelper";
import { PlayerShotsGrid } from "@/bundle/components/PlayerShotsGrid";
import { PressGrid } from "@/bundle/components/PressGrid";
import { GAME_CONSTANTS } from "@/constants/game/board";
import { useGridDimensions } from "@/bundle/hooks/grid/useGridDimensions";
import { RocksPlane } from "@/bundle/layers/RocksPlane";
import { SandPlane } from "@/bundle/layers/SandPlane";
import { ShipsPlane } from "@/bundle/layers/ShipsPlane";
import { TreePlane } from "@/bundle/layers/TreePlane";
import { WaterPlane } from "@/bundle/layers/WaterPlane";
import { useGameStore } from "@/bundle/stores/game/gameStore";

import type { GameGridProps } from "./GameGrid.types";

export const GameGrid: React.FC<GameGridProps> = ({
  position,
  rotation,
  isPlayerBoard = true,
  showShips = true,
  showShots = true,
}) => {
  const { isPlayerTurn } = useGameStore();
  const { calculateTotalGridWidth, calculateTotalGridHeight } =
    useGridDimensions();

  const gridWidth = calculateTotalGridWidth();
  const gridHeight = calculateTotalGridHeight();
  const planeSize = Math.max(
    gridWidth,
    gridHeight,
    GAME_CONSTANTS.BOARD.PLANE_GEOMETRY.MIN_SIZE
  );

  return (
    <mesh rotation={rotation} position={position} scale={1}>
      <planeGeometry
        args={[
          planeSize,
          planeSize,
          GAME_CONSTANTS.BOARD.PLANE_GEOMETRY.SEGMENTS,
          GAME_CONSTANTS.BOARD.PLANE_GEOMETRY.SEGMENTS,
        ]}
      />
      <meshStandardMaterial color="lightblue" wireframe={false} />

      <group>
        <WaterPlane />
        <SandPlane />
        <RocksPlane />
        <TreePlane />

        <GridHelper />

        {isPlayerTurn && !isPlayerBoard && <PressGrid />}
        {showShots && !isPlayerBoard && <PlayerShotsGrid />}
        {showShots && isPlayerBoard && <EnemyShotsGrid />}
        {showShips && isPlayerBoard && <ShipsPlane />}
      </group>
    </mesh>
  );
};
