import { useGameStore } from "../../stores/gameStore";
import GridHelper from "../GridHelper";
import PressGrid from "../PressGrid";
import RocksPlane from "../RocksPlane";
import SandPlane from "../SandPlane";
import ShipsPlane from "../ShipsPlane";
import TreePlane from "../TreePlane";
import WaterPlane from "../WaterPlane";

interface GameGridProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  enablePressGrid?: boolean;
  isPlayerBoard?: boolean;
}

const GameGrid = ({ 
  position, 
  rotation, 
  enablePressGrid, 
  isPlayerBoard = true 
}: GameGridProps) => {
  const { isPlayerTurn } = useGameStore();

  return (
    <mesh rotation={rotation} position={position}>
      <planeGeometry args={[5, 5, 10, 10]} />
      <meshStandardMaterial color="lightblue" wireframe={false} />

      <group>
        <WaterPlane />
        <SandPlane />
        <RocksPlane />
        <TreePlane />

        <GridHelper />
        {enablePressGrid && isPlayerTurn && <PressGrid />}
        <ShipsPlane isPlayerBoard={isPlayerBoard} />
      </group>
    </mesh>
  );
};

export default GameGrid;
