import GameGrid from "./components/GameGrid";
import EnvironmentBox from "./env";

const App = () => {
  return (
    <EnvironmentBox>
      <GameGrid />
      <GameGrid rotation={[0, 0, Math.PI]} position={[0, 9, 0]} />
    </EnvironmentBox>
  );
};

export default App;
