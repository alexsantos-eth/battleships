import { useEffect } from "react";

import GameGrid from "@/components/GameGrid";
import EnvironmentBox from "@/env";
import { useGameStore } from "@/stores/gameStore";
import UIBox from "@/ui";

const App = () => {
  const { initializeGame } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <>
      <EnvironmentBox>
        <GameGrid isPlayerBoard={true} />
        <GameGrid
          isPlayerBoard={false}
          enablePressGrid
          rotation={[0, 0, Math.PI]}
          position={[0, 9, 0]}
        />
      </EnvironmentBox>
      <UIBox />
    </>
  );
};

export default App;
