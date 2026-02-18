import { useEffect, useRef, useState } from "preact/hooks";
import {
  GameInitializer,
  Match,
  type GameConfig,
  type GameEngine,
  type GameEngineState,
  type MatchCallbacks,
} from "../../core/engine";

interface UseMatchProps {
  config?: Partial<GameConfig>;
  callbacks?: MatchCallbacks;
}
const useMatch = ({ config, callbacks }: UseMatchProps | undefined = {}) => {
  const [gameState, setGameState] = useState<GameEngineState | null>(null);
  const match = useRef<Match | null>(null);
  const engine = useRef<GameEngine | null>(null);

  useEffect(() => {
    initializeNewGame();
  }, []);

  const initializeNewGame = () => {
    const initializer = new GameInitializer(config);
    const setup = initializer.initializeGame("random");

    const newMatch = new Match(setup.config, {
      ...callbacks,
      onStateChange: (state) => {
        setGameState(state);
        callbacks?.onStateChange?.(state);
      },
    });

    newMatch.initializeMatch(
      setup.playerShips,
      setup.enemyShips,
      setup.initialTurn,
    );

    match.current = newMatch;
    setGameState(newMatch.getState());

    const engineInstance = newMatch.getEngine();
    engine.current = engineInstance;
  };

  return {
    gameState,
    initializeNewGame,
    match: match.current,
    engine: engine.current,
  };
};

export default useMatch;
