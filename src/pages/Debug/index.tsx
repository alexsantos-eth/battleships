import GameScene from "@/bundle/scene/Scene";

const Debug = () => {
  return <GameScene 
    config={{
      boardHeight: 8,
      boardWidth: 8,
      initialTurn: "player",
      shipCounts: {
        small: 2,
        medium: 2,
        large: 1,
        xlarge: 1,
      },
    }}
  />;
};

export default Debug;
