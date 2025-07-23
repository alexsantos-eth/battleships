import Cannon from "../Cannon";
import Dock from "../Dock";

const DockPlane = () => {
  return (
    <group>
      <Dock key={"dock"} position={[-2.8, 0, 0]} rotation={[0, 0, 0]} />
      <Cannon key={"cannon"} position={[2.8, 0.25, 0]} rotation={[0, 0, 0]} />
    </group>
  );
};

export default DockPlane;
