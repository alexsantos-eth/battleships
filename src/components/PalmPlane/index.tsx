import { useMemo } from "react";

import PalmTree from "../PalmTree";
import { getRandomPalmTrees } from "./utils";

const PalmPlane = () => {
  const palmTrees = useMemo(() => getRandomPalmTrees(), []);

  return (
    <group rotation={[Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 0.1]}>
      {palmTrees.map((palmTree, idx) => (
        <PalmTree
          key={idx}
          position={palmTree.position}
          rotation={palmTree.rotation}
          variant={palmTree.variant}
        />
      ))}
    </group>
  );
};

export default PalmPlane;
