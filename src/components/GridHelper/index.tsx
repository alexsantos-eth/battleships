import { COLORS } from "@/config/colors";
import { useGridDimensions } from "@/hooks/useGridDimensions";

const GridHelper: React.FC = () => {
  const { boardWidth, boardHeight, calculateTotalGridWidth, calculateTotalGridHeight } = useGridDimensions();
  
  const gridWidth = calculateTotalGridWidth();
  const gridHeight = calculateTotalGridHeight();
  const gridSize = Math.max(gridWidth, gridHeight);

  return (
    <gridHelper
      args={[gridSize, Math.max(boardWidth, boardHeight), COLORS.grid.lines, COLORS.grid.lines]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0.21]}
    />
  );
};

export default GridHelper;
