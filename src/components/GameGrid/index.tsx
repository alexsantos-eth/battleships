import PressGrid from "../PressGrid";
import RocksPlane from "../RocksPlane";
import ShipsPlane from "../ShipsPlane";
import WaterPlane from "../WaterPlane";

const GameGrid = () => {
  return (
    <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[5, 5, 10, 10]} />
      <meshStandardMaterial color="lightblue" wireframe={false} />

      <group>
        <WaterPlane />
        <gridHelper
          args={[5, 10, "#ddd", "#ddd"]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0.21]}
        />
        <PressGrid />
        <ShipsPlane />
        <RocksPlane />
      </group>
    </mesh>
  );
};

export default GameGrid;
