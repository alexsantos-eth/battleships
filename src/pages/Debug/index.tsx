import { useEnemyAI } from "@/bundle/controller/enemy/hooks/useEnemyAI";
import GameScene from "@/bundle/scene/Scene";
import { generateShips } from "@/tools/ship/calculations";

import type { GameShip } from "@/types/game/common";
import type { GameConfig } from "@/types/game/config";

const config: Partial<GameConfig> = {
  boardHeight: 10,
  boardWidth: 10,
  shipCounts: {
    small: 2,
    medium: 2,
    large: 1,
    xlarge: 1,
  },
};

const playerShips: GameShip[] = generateShips(config);
const enemyShips: GameShip[] = generateShips(config);

const Debug = () => {
  useEnemyAI();

  return (
    <GameScene
      gameSetup={{
        config,
        playerShips,
        enemyShips,
      }}
    />
  );
};

export default Debug;
