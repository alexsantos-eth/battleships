/**
 * Benchmark Comparativo: GameEngine vs FastGameEngine
 * 
 * Demuestra las mejoras de rendimiento para simulaciones masivas
 */

import { GameEngine, GameInitializer, AIPlayer } from "../engine";
import { FastGameEngine, FastAIPlayer } from "../engine/fast-logic";

interface BenchmarkResult {
  name: string;
  games: number;
  totalTime: number;
  avgTime: number;
  gamesPerSecond: number;
  totalShots: number;
  avgShots: number;
}

/**
 * Simular con GameEngine actual
 */
function simulateWithCurrentEngine(numGames: number): BenchmarkResult {
  const start = performance.now();
  let totalShots = 0;

  for (let i = 0; i < numGames; i++) {
    const initializer = new GameInitializer();
    const setup = initializer.initializeGame();
    
    const engine = new GameEngine(setup.config);
    engine.initializeGame(setup.playerShips, setup.enemyShips, setup.initialTurn);
    
    const playerAI = new AIPlayer(engine, true);
    const enemyAI = new AIPlayer(engine, false);
    
    let shots = 0;
    while (!engine.getState().isGameOver && shots < 1000) {
      const isPlayerTurn = engine.isPlayerTurn();
      const ai = isPlayerTurn ? playerAI : enemyAI;
      const shot = ai.generateRandomShot();
      
      if (!shot) break;
      
      engine.executeShot(shot[0], shot[1], isPlayerTurn);
      shots++;
      
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
    
    totalShots += shots;
  }

  const totalTime = performance.now() - start;

  return {
    name: "GameEngine (Actual)",
    games: numGames,
    totalTime,
    avgTime: totalTime / numGames,
    gamesPerSecond: (numGames / totalTime) * 1000,
    totalShots,
    avgShots: totalShots / numGames,
  };
}

/**
 * Simular con FastGameEngine optimizado
 */
function simulateWithFastEngine(numGames: number): BenchmarkResult {
  const start = performance.now();
  let totalShots = 0;

  for (let i = 0; i < numGames; i++) {
    const initializer = new GameInitializer();
    const setup = initializer.initializeGame();
    
    const engine = new FastGameEngine(setup.config);
    engine.initializeGame(setup.playerShips, setup.enemyShips, setup.initialTurn);
    
    const playerAI = new FastAIPlayer(engine, true);
    const enemyAI = new FastAIPlayer(engine, false);
    
    let shots = 0;
    while (!engine.getIsGameOver() && shots < 1000) {
      const isPlayerTurn = engine.isPlayerTurn();
      const ai = isPlayerTurn ? playerAI : enemyAI;
      const shot = ai.generateRandomShot();
      
      if (!shot) break;
      
      const result = engine.executeShot(shot[0], shot[1], isPlayerTurn);
      shots++;
      
      if (!result.isGameOver && !result.hit) {
        engine.toggleTurn();
      }
    }
    
    totalShots += shots;
  }

  const totalTime = performance.now() - start;

  return {
    name: "FastGameEngine (Optimizado)",
    games: numGames,
    totalTime,
    avgTime: totalTime / numGames,
    gamesPerSecond: (numGames / totalTime) * 1000,
    totalShots,
    avgShots: totalShots / numGames,
  };
}

/**
 * Imprimir resultados formateados
 */
function printResults(current: BenchmarkResult, fast: BenchmarkResult) {
  console.log('\n' + '═'.repeat(80));
  console.log('📊  RESULTADOS DEL BENCHMARK');
  console.log('═'.repeat(80));
  
  console.log('\n┌─ GameEngine Actual');
  console.log(`│  Tiempo total:      ${(current.totalTime / 1000).toFixed(2)}s`);
  console.log(`│  Tiempo promedio:   ${current.avgTime.toFixed(2)}ms por juego`);
  console.log(`│  Juegos/segundo:    ${current.gamesPerSecond.toFixed(2)}`);
  console.log(`│  Disparos promedio: ${current.avgShots.toFixed(1)}`);
  console.log('└─');
  
  console.log('\n┌─ FastGameEngine Optimizado');
  console.log(`│  Tiempo total:      ${(fast.totalTime / 1000).toFixed(2)}s`);
  console.log(`│  Tiempo promedio:   ${fast.avgTime.toFixed(2)}ms por juego`);
  console.log(`│  Juegos/segundo:    ${fast.gamesPerSecond.toFixed(2)}`);
  console.log(`│  Disparos promedio: ${fast.avgShots.toFixed(1)}`);
  console.log('└─');
  
  const speedup = current.totalTime / fast.totalTime;
  const improvement = ((speedup - 1) * 100).toFixed(1);
  
  console.log('\n🚀  MEJORA DE RENDIMIENTO');
  console.log('─'.repeat(80));
  console.log(`   Aceleración:        ${speedup.toFixed(2)}x más rápido`);
  console.log(`   Mejora:             ${improvement}% más eficiente`);
  console.log(`   Tiempo ahorrado:    ${((current.totalTime - fast.totalTime) / 1000).toFixed(2)}s`);
  
  console.log('\n💡  PROYECCIÓN PARA 1 MILLÓN DE JUEGOS');
  console.log('─'.repeat(80));
  const millionCurrentTime = (current.avgTime * 1_000_000) / 1000 / 60;
  const millionFastTime = (fast.avgTime * 1_000_000) / 1000 / 60;
  console.log(`   GameEngine actual:   ${millionCurrentTime.toFixed(1)} minutos`);
  console.log(`   FastGameEngine:      ${millionFastTime.toFixed(1)} minutos`);
  console.log(`   Ahorro de tiempo:    ${(millionCurrentTime - millionFastTime).toFixed(1)} minutos`);
  
  console.log('\n' + '═'.repeat(80) + '\n');
}

/**
 * Ejecutar benchmark comparativo
 */
export function runComparativeBenchmark(numGames: number = 1000) {
  console.log(`\n🔬  BENCHMARK COMPARATIVO: ${numGames} simulaciones\n`);
  
  console.log('⏳  Ejecutando con GameEngine actual...');
  const currentResult = simulateWithCurrentEngine(numGames);
  
  console.log('⏳  Ejecutando con FastGameEngine optimizado...');
  const fastResult = simulateWithFastEngine(numGames);
  
  printResults(currentResult, fastResult);
}

/**
 * Ejecutar múltiples benchmarks con diferentes tamaños
 */
export function runFullComparison() {
  console.log('\n🎯  COMPARACIÓN COMPLETA DE RENDIMIENTO\n');
  
  const sizes = [100, 1000, 5000];
  
  for (const size of sizes) {
    runComparativeBenchmark(size);
  }
}


