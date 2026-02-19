import { useEffect, useRef, useState, useMemo } from "react";
import {
  GameInitializer,
  Match,
  type GameConfig,
  type GameEngine,
  type GameEngineState,
  type GameShip,
  type MatchCallbacks,
} from "../../core/engine";
import { getShipCellsFromShip } from "../../core/tools/ship/calculations";
import type { GAME_INITIAL_TURN } from "../../core/manager/initializer";

export type CellState = "EMPTY" | "SHIP" | "HIT" | "MISS";
export type Board = CellState[][];

interface UseMatchProps extends MatchCallbacks{
  config?: Partial<GameConfig>;
  startTurn?: GAME_INITIAL_TURN,
  ships?: {
    playerShips: GameShip[];
    enemyShips: GameShip[];
  };
}

const useMatch = ({
  config,
  ships,
  startTurn,
  ...callbacks
}: UseMatchProps | undefined = {}) => {
  const [gameState, setGameState] = useState<GameEngineState | null>(null);
  const match = useRef<Match | null>(null);
  const engine = useRef<GameEngine | null>(null);

  useEffect(() => {
    initializeNewGame();
  }, []);

  const initializeNewGame = () => {
    const initializer = new GameInitializer(config);
    const setup = initializer.initializeGame(startTurn ?? "random", ships);

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

  const playerBoard = useMemo<Board | null>(() => {
    if (!gameState) return null;

    const board: Board = Array.from({ length: gameState.boardHeight }, () =>
      Array(gameState.boardWidth).fill("EMPTY"),
    );

    for (const ship of gameState.playerShips) {
      const cells = getShipCellsFromShip(ship);
      for (const [x, y] of cells) {
        if (
          x >= 0 &&
          x < gameState.boardWidth &&
          y >= 0 &&
          y < gameState.boardHeight
        ) {
          board[y][x] = "SHIP";
        }
      }
    }

    for (const shot of gameState.enemyShots) {
      if (
        shot.x >= 0 &&
        shot.x < gameState.boardWidth &&
        shot.y >= 0 &&
        shot.y < gameState.boardHeight
      ) {
        board[shot.y][shot.x] = shot.hit ? "HIT" : "MISS";
      }
    }

    return board;
  }, [gameState]);

  const enemyBoard = useMemo<Board | null>(() => {
    if (!gameState) return null;

    const board: Board = Array.from({ length: gameState.boardHeight }, () =>
      Array(gameState.boardWidth).fill("EMPTY"),
    );

    for (const shot of gameState.playerShots) {
      if (
        shot.x >= 0 &&
        shot.x < gameState.boardWidth &&
        shot.y >= 0 &&
        shot.y < gameState.boardHeight
      ) {
        board[shot.y][shot.x] = shot.hit ? "HIT" : "MISS";
      }
    }

    return board;
  }, [gameState]);

  return {
    gameState,
    playerBoard,
    enemyBoard,
    initializeNewGame,
    match: match.current,
    engine: engine.current,
  };
};

export default useMatch;
