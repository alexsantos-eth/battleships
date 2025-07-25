import { COLORS } from "../../config/colors";

const GridHelper: React.FC = () => {
  return (
    <gridHelper
      args={[5, 10, COLORS.grid.lines, COLORS.grid.lines]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0.21]}
    />
  );
};

export default GridHelper;
