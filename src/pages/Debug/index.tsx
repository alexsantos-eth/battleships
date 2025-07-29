import { Game } from "@/bundle/components/Game";
import { useEnemyAI } from "@/bundle/controller/enemy/hooks/useEnemyAI";

const Debug = () => {
  useEnemyAI();
  return <Game />;
};

export default Debug;
