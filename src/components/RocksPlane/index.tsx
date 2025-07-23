import { useMemo } from "react";

import Rock from "../Rock";
import { generateRandomRocks } from "./utils";

const RocksPlane = () => {
  const rocks = useMemo(() => generateRandomRocks(), []);

  return (
    <group>
      {rocks.map((rock) => (
        <Rock
          key={rock.id}
          variant={rock.variant}
          position={rock.position}
          rotation={rock.rotation}
        />
      ))}
    </group>
  );
};

export default RocksPlane;
