export { GameEngine } from "./logic";
export type { GameEngineState, ShotResult, GameEngineCallbacks } from "./logic";

export { Match } from "./match";
export type { MatchShotResult, MatchCallbacks } from "./match";

export type { SimulationResult } from "../../examples/runSimulation";

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
