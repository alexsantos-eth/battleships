import { GameInitializer, Match } from "../core/engine";
import { AIPlayer, SmartAIPlayer } from "../simulations/automata";
import { runSimulation, runSimulationWithAI } from "./runSimulation";

/**
 * Example 1: Run a simple simulation with random AI players
 */
export function runBasicSimulation() {
  // Initialize a new game
  const initializer = new GameInitializer();
  const setup = initializer.initializeGame("random");

  // Create and initialize match
  const match = new Match(setup.config);
  match.initializeMatch(
    setup.playerShips,
    setup.enemyShips,
    setup.initialTurn
  );

  // Debug: Check initial state
  const initialState = match.getState();
  console.log("=== Initial State ===");
  console.log(`Player Ships: ${initialState.playerShips.length}`);
  console.log(`Enemy Ships: ${initialState.enemyShips.length}`);
  console.log(`Board: ${initialState.boardWidth}x${initialState.boardHeight}`);

  // Run the simulation
  const result = runSimulation(match);

  console.log("\n=== Simulation Complete ===");
  console.log(`Winner: ${result.winner || 'NONE (ERROR!)'}`);
  console.log(`Total Shots: ${result.totalShots}`);
  console.log(`Player Shots: ${result.playerShots}`);
  console.log(`Enemy Shots: ${result.enemyShots}`);
  console.log(`Turns: ${result.turns}`);
  
  // Debug: Final state
  const finalState = match.getState();
  console.log(`Game Over: ${finalState.isGameOver}`);

  return result;
}

/**
 * Example 2: Run a simulation with custom AI (Smart AI vs Random AI)
 */
export function runSmartVsRandomSimulation() {
  const initializer = new GameInitializer();
  const setup = initializer.initializeGame("random");

  const match = new Match(setup.config);
  match.initializeMatch(
    setup.playerShips,
    setup.enemyShips,
    setup.initialTurn
  );

  const engine = match.getEngine();
  
  // Player uses smart AI, enemy uses random AI
  // IMPORTANT: playerAI with isPlayer=true, enemyAI with isPlayer=false
  const playerAI = new SmartAIPlayer(engine, true);
  const enemyAI = new AIPlayer(engine, false);

  const result = runSimulationWithAI(match, playerAI, enemyAI);

  console.log("=== Smart AI vs Random AI ===");
  console.log(`Winner: ${result.winner}`);
  console.log(`Total Shots: ${result.totalShots}`);
  console.log(`Turns: ${result.turns}`);

  return result;
}

/**
 * Example 3: Run multiple simulations and collect statistics
 */
export function runMultipleSimulations(count: number = 100) {
  let playerWins = 0;
  let enemyWins = 0;
  let totalShots = 0;
  let totalTurns = 0;

  console.log(`Running ${count} simulations...`);

  for (let i = 0; i < count; i++) {
    const initializer = new GameInitializer();
    const setup = initializer.initializeGame("random");

    const match = new Match(setup.config);
    match.initializeMatch(
      setup.playerShips,
      setup.enemyShips,
      setup.initialTurn
    );

    const result = runSimulation(match);

    if (result.winner === "player") playerWins++;
    else if (result.winner === "enemy") enemyWins++;

    totalShots += result.totalShots;
    totalTurns += result.turns;
  }

  const stats = {
    totalSimulations: count,
    playerWins,
    enemyWins,
    playerWinRate: (playerWins / count) * 100,
    enemyWinRate: (enemyWins / count) * 100,
    avgShots: totalShots / count,
    avgTurns: totalTurns / count,
  };

  console.log("\n=== Statistics ===");
  console.log(`Total Simulations: ${stats.totalSimulations}`);
  console.log(`Player Wins: ${stats.playerWins} (${stats.playerWinRate.toFixed(1)}%)`);
  console.log(`Enemy Wins: ${stats.enemyWins} (${stats.enemyWinRate.toFixed(1)}%)`);
  console.log(`Average Shots: ${stats.avgShots.toFixed(1)}`);
  console.log(`Average Turns: ${stats.avgTurns.toFixed(1)}`);

  return stats;
}

// Uncomment to run examples:
// runBasicSimulation();
// runSmartVsRandomSimulation();
// runMultipleSimulations(100);
