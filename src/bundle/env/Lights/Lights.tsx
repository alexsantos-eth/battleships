import { DEBUG_CONFIG } from "@/constants/debug/settings";

import LightsControls from "./Controls/Controls";

const Lights: React.FC = () => {
  if (!DEBUG_CONFIG.ENABLE_LIGHT_CONTROLS) {
    return (
      <>
        <ambientLight intensity={1} color="white" />

        <directionalLight
          color="white"
          intensity={0.7}
          position={[0, 0, 5]}
          castShadow={false}
        />

        <directionalLight
          color="white"
          intensity={0.4}
          position={[0, -10, 5]}
          castShadow={false}
        />
      </>
    );
  }

  return <LightsControls />;
};

export default Lights;
