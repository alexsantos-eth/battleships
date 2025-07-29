import React from "react";

import { useGridDimensions } from "@/bundle/hooks/grid/useGridDimensions";
import { COLORS } from "@/config/colors/palette";

import type { GridHelperProps } from "./GridHelper.types";

export const GridHelper: React.FC<GridHelperProps> = () => {
  const {
    boardWidth,
    boardHeight,
    calculateTotalGridWidth,
    calculateTotalGridHeight,
  } = useGridDimensions();

  const gridWidth = calculateTotalGridWidth();
  const gridHeight = calculateTotalGridHeight();
  const gridSize = Math.max(gridWidth, gridHeight);

  return (
    <gridHelper
      args={[
        gridSize,
        Math.max(boardWidth, boardHeight),
        COLORS.grid.lines,
        COLORS.grid.lines,
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0.21]}
    />
  );
};
