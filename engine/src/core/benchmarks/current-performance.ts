/**
 * Benchmark del rendimiento actual del core
 * 
 * Este script demuestra los problemas de rendimiento cuando se ejecutan
 * miles de simulaciones con el engine actual.
 */

import { GameEngine, GameInitializer, AIPlayer } from "../engine";

/**
 * Simula un juego completo entre dos AIs
 * @returns Número de disparos hasta terminar el juego
 */
function simulateSingleGame(): { shots: number; winner: string; duration: number } {
  const start = performance.now();
  
  const initializer = new GameInitializer();
  const setup = initializer.initializeGame();
  
  const engine = new GameEngine(setup.config);
  engine.initializeGame(
    setup.playerShips,
    setup.enemyShips,
    setup.initialTurn
  );
  
  const playerAI = new AIPlayer(engine, true);
  const enemyAI = new AIPlayer(engine, false);
  
  let shots = 0;
  const maxShots = 1000; // Prevenir loops infinitos
  
  while (!engine.getState().isGameOver && shots < maxShots) {
    const isPlayerTurn = engine.isPlayerTurn();
    const ai = isPlayerTurn ? playerAI : enemyAI;
    
    const shot = ai.generateRandomShot();
    if (!shot) break;
    
    engine.executeShot(shot[0], shot[1], isPlayerTurn);
    shots++;
    
    // Alternar turno si falló
    const state = engine.getState();
    if (!state.isGameOver) {
      const lastShot = isPlayerTurn 
        ? state.playerShots[state.playerShots.length - 1]
        : state.enemyShots[state.enemyShots.length - 1];
      
      if (!lastShot.hit) {
        engine.toggleTurn();
      }
    }
  }
  
  const duration = performance.now() - start;
  const winner = engine.getWinner() || 'draw';
  
  return { shots, winner, duration };
}

/**
 * Ejecuta múltiples simulaciones y mide el rendimiento
 */
export function benchmarkCurrentEngine(numSimulations: number = 1000) {
  console.log(`\n🎮 Benchmark: ${numSimulations} simulaciones\n`);
  console.log('━'.repeat(60));
  
  const results = {
    totalGames: numSimulations,
    totalShots: 0,
    totalDuration: 0,
    playerWins: 0,
    enemyWins: 0,
    draws: 0,
    durations: [] as number[],
  };
  
  const start = performance.now();
  
  for (let i = 0; i < numSimulations; i++) {
    const game = simulateSingleGame();
    
    results.totalShots += game.shots;
    results.totalDuration += game.duration;
    results.durations.push(game.duration);
    
    if (game.winner === 'player') results.playerWins++;
    else if (game.winner === 'enemy') results.enemyWins++;
    else results.draws++;
    
    // Progreso cada 100 juegos
    if ((i + 1) % 100 === 0) {
      console.log(`\rProgreso: ${i + 1}/${numSimulations} juegos...`);
    }
  }
  
  const totalTime = performance.now() - start;
  
  console.log('\n\n📊 Resultados:\n');
  console.log(`Total tiempo:        ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Juegos/segundo:      ${(numSimulations / (totalTime / 1000)).toFixed(2)}`);
  console.log(`Tiempo promedio:     ${(results.totalDuration / numSimulations).toFixed(2)}ms por juego`);
  console.log(`Disparos promedio:   ${(results.totalShots / numSimulations).toFixed(1)}`);
  console.log(`\nResultados:`);
  console.log(`  Victorias jugador: ${results.playerWins} (${(results.playerWins / numSimulations * 100).toFixed(1)}%)`);
  console.log(`  Victorias enemigo: ${results.enemyWins} (${(results.enemyWins / numSimulations * 100).toFixed(1)}%)`);
  console.log(`  Empates:           ${results.draws} (${(results.draws / numSimulations * 100).toFixed(1)}%)`);
  
  // Análisis de performance
  results.durations.sort((a, b) => a - b);
  const p50 = results.durations[Math.floor(results.durations.length * 0.5)];
  const p95 = results.durations[Math.floor(results.durations.length * 0.95)];
  const p99 = results.durations[Math.floor(results.durations.length * 0.99)];
  
  console.log(`\n⏱️  Latencias:`);
  console.log(`  P50 (median):      ${p50.toFixed(2)}ms`);
  console.log(`  P95:               ${p95.toFixed(2)}ms`);
  console.log(`  P99:               ${p99.toFixed(2)}ms`);
  console.log(`  Min:               ${results.durations[0].toFixed(2)}ms`);
  console.log(`  Max:               ${results.durations[results.durations.length - 1].toFixed(2)}ms`);
  
  console.log('\n━'.repeat(60));
  
  return results;
}

/**
 * Comparación: 100, 1000, 10000 simulaciones
 */
export function runFullBenchmark() {
  console.log('\n🔥 BENCHMARK COMPLETO - Engine Actual\n');
  
  const sizes = [100, 1000, 10000];
  
  for (const size of sizes) {
    benchmarkCurrentEngine(size);
  }
}

