export { GameEngine } from "./logic";
export type { GameEngineState, ShotResult, GameEngineCallbacks } from "./logic";

export { Match } from "./match";
export type { MatchShotResult, MatchCallbacks } from "./match";

// Optimized engine for massive simulations
export { FastGameEngine, FastAIPlayer } from "./fast-logic";
export type { FastShotResult } from "./fast-logic";

export { AIPlayer, SmartAIPlayer } from "../simulations/automata";

export { GameInitializer } from "../manager";
export type { GameSetup } from "../manager";

export type {
  GameShip,
  Shot,
  Winner,
  GameTurn,
  ShipVariant,
  ShipOrientation,
} from "../types/common";

export type { GameConfig } from "../types/config";
