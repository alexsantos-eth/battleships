import PressGrid from "../PressGrid";
import WaterPlane from "../WaterPlane";

const GameGrid = () => {
  return (
    <mesh rotation={[-Math.PI / 4, 0, Math.PI / 4]} position={[0, 0, -1]}>
      <planeGeometry args={[5, 5, 10, 10]} />
      <meshStandardMaterial color="lightblue" wireframe={false} />

      <group>
        <WaterPlane />
        <gridHelper
          args={[5, 10, "white", "white"]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0.2]}
        />
        <PressGrid />
      </group>
    </mesh>
  );
};

export default GameGrid;
