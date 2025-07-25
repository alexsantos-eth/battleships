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
}
const GameGrid = ({ position, rotation }: GameGridProps) => {
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
        <PressGrid />
        <ShipsPlane />
      </group>
    </mesh>
  );
};

export default GameGrid;
