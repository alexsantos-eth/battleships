import GameGrid from "./components/GameGrid";
import EnvironmentBox from "./env";
import { DebugInfo } from "./components/DebugInfo";

const App = () => {
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
      <DebugInfo />
    </>
  );
};

export default App;
