import GridHelper from "@/components/GridHelper";
import PressGrid from "@/components/PressGrid";
import PlayerShotsGrid from "@/components/PlayerShotsGrid";
import EnemyShotsGrid from "@/components/EnemyShotsGrid";
import RocksPlane from "@/components/RocksPlane";
import SandPlane from "@/components/SandPlane";
import ShipsPlane from "@/components/ShipsPlane";
import TreePlane from "@/components/TreePlane";
import WaterPlane from "@/components/WaterPlane";
import { useGameStore } from "@/stores/gameStore";
import { useGridDimensions } from "@/hooks/useGridDimensions";

interface GameGridProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  enablePressGrid?: boolean;
  isPlayerBoard?: boolean;
  showShips?: boolean;
  showShots?: boolean;
  alwaysShowEnemyShips?: boolean;
}

const GameGrid = ({
  position,
  rotation,
  enablePressGrid,
  isPlayerBoard = true,
  showShips = true,
  showShots = true,
  alwaysShowEnemyShips = false,
}: GameGridProps) => {
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
        {/* PressGrid para interacción del jugador */}
        {enablePressGrid && isPlayerTurn && !isPlayerBoard && <PressGrid />}
        {/* PlayerShotsGrid para mostrar disparos del jugador */}
        {showShots && !isPlayerBoard && <PlayerShotsGrid />}
        {/* EnemyShotsGrid para mostrar disparos del enemigo */}
        {showShots && isPlayerBoard && <EnemyShotsGrid />}
        {showShips && <ShipsPlane isPlayerBoard={isPlayerBoard} alwaysShowEnemyShips={alwaysShowEnemyShips} />}
      </group>
    </mesh>
  );
};

export default GameGrid;
