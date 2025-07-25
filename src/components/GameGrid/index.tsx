import GridHelper from "@/components/GridHelper";
import PressGrid from "@/components/PressGrid";
import RocksPlane from "@/components/RocksPlane";
import SandPlane from "@/components/SandPlane";
import ShipsPlane from "@/components/ShipsPlane";
import TreePlane from "@/components/TreePlane";
import WaterPlane from "@/components/WaterPlane";
import { useGameStore } from "@/stores/gameStore";

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
  isPlayerBoard = true,
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
