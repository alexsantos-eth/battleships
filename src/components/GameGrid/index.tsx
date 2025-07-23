import DockPlane from "../DockPlane";
import PalmPlane from "../PalmPlane";
import PressGrid from "../PressGrid";
import RocksPlane from "../RocksPlane";
import SandPlane from "../SandPlane";
import ShipsPlane from "../ShipsPlane";
import WaterPlane from "../WaterPlane";

const GameGrid = () => {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[5, 5, 10, 10]} />
      <meshStandardMaterial color="lightblue" wireframe={false} />

      <group>
        <SandPlane />
        <WaterPlane />
        <gridHelper
          args={[5, 10, "#ddd", "#ddd"]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0.21]}
        />
        <PressGrid />
        <ShipsPlane />
        <RocksPlane />
        <DockPlane />
        <PalmPlane />
      </group>
    </mesh>
  );
};

export default GameGrid;
