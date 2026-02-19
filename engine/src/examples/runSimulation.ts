import { Match } from "../core/engine/match";
import type { Winner } from "../core/types/common";
import { AIPlayer } from "../simulations/automata";

/**
 * Result of a complete match simulation
 */
export interface SimulationResult {
  winner: Winner;
  totalShots: number;
  playerShots: number;
  enemyShots: number;
  turns: number;
}

/**
 * Run a complete match simulation using AI players
 * 
 * This function runs a match from start to finish without React state.
 * Both player and enemy are controlled by AI, making random shots until
 * someone wins.
 * 
 * @param match - An initialized Match instance
 * @param maxTurns - Safety limit to prevent infinite loops (default: 1000)
 * @returns Simulation result with winner and statistics
 * 
 * @example
 * ```typescript
 * const initializer = new GameInitializer();
 * const setup = initializer.initializeGame("random");
 * const match = new Match(setup.config);
 * match.initializeMatch(setup.playerShips, setup.enemyShips, setup.initialTurn);
 * 
 * const result = runSimulation(match);
 * console.log(`Winner: ${result.winner}, Total shots: ${result.totalShots}`);
 * ```
 */
export function runSimulation(
  match: Match,
  maxTurns: number = 1000
): SimulationResult {
  // Create AI players for both sides
  const engine = match.getEngine();
  const playerAI = new AIPlayer(engine, true);  // AI for player turn (checks player's shots)
  const enemyAI = new AIPlayer(engine, false);  // AI for enemy turn (checks enemy's shots)

  let turns = 0;

  // Run the simulation until match is over or max turns reached
  while (!match.isMatchOver() && turns < maxTurns) {
    // Determine whose turn it is and get the appropriate AI
    const isPlayerTurn = match.isPlayerTurn();
    const currentAI = isPlayerTurn ? playerAI : enemyAI;

    // Generate a shot from the current AI
    const shot = currentAI.generateRandomShot();

    // If no valid shot available, break (shouldn't happen in normal gameplay)
    if (!shot) {
      console.warn(`No available shots for ${isPlayerTurn ? 'player' : 'enemy'} at turn ${turns}`);
      break;
    }

    const [x, y] = shot;

    // Execute the shot
    const result = match.executeShot(x, y, isPlayerTurn);

    // If the shot failed (shouldn't happen with valid positions), break
    if (!result.success) {
      console.warn(`Shot failed at (${x}, ${y}): ${result.error}`);
      break;
    }

    // Increment turn counter when turn changes
    if (result.turnEnded) {
      turns++;
    }
  }

  // Get final state and statistics
  const finalState = match.getState();
  const winner = match.getWinner();

  return {
    winner,
    totalShots: finalState.shotCount,
    playerShots: finalState.playerShots.length,
    enemyShots: finalState.enemyShots.length,
    turns,
  };
}

/**
 * Run a simulation with custom AI players (e.g., SmartAIPlayer)
 * 
 * This version allows injecting custom AI implementations for both sides.
 * 
 * IMPORTANT: When creating AI players:
 * - playerAI should be created with isPlayer=true (to track player's shots)
 * - enemyAI should be created with isPlayer=false (to track enemy's shots)
 * 
 * @example
 * ```typescript
 * const engine = match.getEngine();
 * const playerAI = new SmartAIPlayer(engine, true);   // isPlayer=true for player
 * const enemyAI = new AIPlayer(engine, false);        // isPlayer=false for enemy
 * const result = runSimulationWithAI(match, playerAI, enemyAI);
 * ```
 * 
 * @param match - An initialized Match instance
 * @param playerAI - AI instance controlling the player (created with isPlayer=true)
 * @param enemyAI - AI instance controlling the enemy (created with isPlayer=false)
 * @param maxTurns - Safety limit to prevent infinite loops (default: 1000)
 * @returns Simulation result with winner and statistics
 */
export function runSimulationWithAI(
  match: Match,
  playerAI: AIPlayer,
  enemyAI: AIPlayer,
  maxTurns: number = 1000
): SimulationResult {
  let turns = 0;

  while (!match.isMatchOver() && turns < maxTurns) {
    const isPlayerTurn = match.isPlayerTurn();
    const currentAI = isPlayerTurn ? playerAI : enemyAI;

    const shot = currentAI.generateRandomShot();

    if (!shot) {
      console.warn(`No available shots for ${isPlayerTurn ? 'player' : 'enemy'} at turn ${turns}`);
      break;
    }

    const [x, y] = shot;
    const result = match.executeShot(x, y, isPlayerTurn);

    if (!result.success) {
      console.warn(`Shot failed at (${x}, ${y}): ${result.error}`);
      break;
    }

    if (result.turnEnded) {
      turns++;
    }
  }

  const finalState = match.getState();
  const winner = match.getWinner();

  return {
    winner,
    totalShots: finalState.shotCount,
    playerShots: finalState.playerShots.length,
    enemyShots: finalState.enemyShots.length,
    turns,
  };
}
