/**
 * Ejemplo de uso: GameEngine vs FastGameEngine
 * 
 * Demuestra cuándo y cómo usar cada engine
 */

import { 
  GameEngine, 
  FastGameEngine, 
  GameInitializer, 
  AIPlayer, 
  FastAIPlayer 
} from "../engine";

console.log("\n🎮 EJEMPLO: Uso de GameEngine vs FastGameEngine\n");

// ============================================
// 1. GameEngine - Para UI y desarrollo
// ============================================
console.log("📱 Caso 1: Juego con UI (usar GameEngine)\n");

const initializer = new GameInitializer();
const setup = initializer.initializeGame();

const gameEngine = new GameEngine(setup.config, {
  onShot: (shot, isPlayerShot) => {
    console.log(`  💥 Disparo ${isPlayerShot ? 'jugador' : 'enemigo'}: (${shot.x}, ${shot.y}) - ${shot.hit ? 'HIT' : 'MISS'}`);
  },
  onGameOver: (winner) => {
    console.log(`  🏆 Game Over! Ganador: ${winner}`);
  },
});

gameEngine.initializeGame(setup.playerShips, setup.enemyShips);

// Simular unos pocos disparos para demostración
const playerAI = new AIPlayer(gameEngine, true);
const enemyAI = new AIPlayer(gameEngine, false);

let shotCount = 0;
while (!gameEngine.getState().isGameOver && shotCount < 5) {
  const isPlayerTurn = gameEngine.isPlayerTurn();
  const ai = isPlayerTurn ? playerAI : enemyAI;
  const shot = ai.generateRandomShot();
  
  if (shot) {
    gameEngine.executeShot(shot[0], shot[1], isPlayerTurn);
    shotCount++;
    
    const state = gameEngine.getState();
    if (!state.isGameOver) {
      const lastShot = isPlayerTurn 
        ? state.playerShots[state.playerShots.length - 1]
        : state.enemyShots[state.enemyShots.length - 1];
      
      if (!lastShot.hit) {
        gameEngine.toggleTurn();
      }
    }
  }
}

console.log(`\n  ✓ Callbacks funcionan perfectamente para UI\n`);

// ============================================
// 2. FastGameEngine - Para simulaciones
// ============================================
console.log("━".repeat(60));
console.log("\n🚀 Caso 2: Simulaciones masivas (usar FastGameEngine)\n");

const NUM_SIMULATIONS = 100;

// Medir tiempo con GameEngine
console.log(`  Ejecutando ${NUM_SIMULATIONS} simulaciones con GameEngine...`);
const startNormal = performance.now();

for (let i = 0; i < NUM_SIMULATIONS; i++) {
  const setup = initializer.initializeGame();
  const engine = new GameEngine(setup.config); // Sin callbacks
  engine.initializeGame(setup.playerShips, setup.enemyShips);
  
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
}

const timeNormal = performance.now() - startNormal;
console.log(`  ✓ Completado en ${(timeNormal / 1000).toFixed(2)}s`);

// Medir tiempo con FastGameEngine
console.log(`\n  Ejecutando ${NUM_SIMULATIONS} simulaciones con FastGameEngine...`);
const startFast = performance.now();

for (let i = 0; i < NUM_SIMULATIONS; i++) {
  const setup = initializer.initializeGame();
  const engine = new FastGameEngine(setup.config);
  engine.initializeGame(setup.playerShips, setup.enemyShips);
  
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
}

const timeFast = performance.now() - startFast;
console.log(`  ✓ Completado en ${(timeFast / 1000).toFixed(2)}s`);

// Comparación
const speedup = timeNormal / timeFast;
const improvement = ((speedup - 1) * 100).toFixed(1);

console.log("\n📊 Comparación:");
console.log(`  GameEngine:      ${(timeNormal / 1000).toFixed(2)}s`);
console.log(`  FastGameEngine:  ${(timeFast / 1000).toFixed(2)}s`);
console.log(`  Speedup:         ${speedup.toFixed(2)}x más rápido`);
console.log(`  Mejora:          ${improvement}% más eficiente\n`);

// ============================================
// 3. Cuándo usar cada uno
// ============================================
console.log("━".repeat(60));
console.log("\n💡 RECOMENDACIONES DE USO\n");

console.log("✅ Usa GameEngine cuando:");
console.log("   • Desarrollas UI interactiva");
console.log("   • Necesitas callbacks para actualizar la UI");
console.log("   • Debugging y desarrollo");
console.log("   • Partidas individuales con usuarios\n");

console.log("✅ Usa FastGameEngine cuando:");
console.log("   • Simulaciones masivas (>1000 juegos)");
console.log("   • Análisis estadístico de estrategias");
console.log("   • Testing automatizado");
console.log("   • Entrenamiento de ML/IA");
console.log("   • Benchmarking de rendimiento\n");

console.log("━".repeat(60) + "\n");

// ============================================
// 4. Ejemplo de uso híbrido
// ============================================
console.log("🔀 Ejemplo: Uso Híbrido\n");

console.log("  Análisis de estrategias:");
console.log("  1. Simular 10,000 juegos con FastGameEngine");
console.log("  2. Identificar mejores estrategias");
console.log("  3. Implementar en UI con GameEngine\n");

console.log("✓ Lo mejor de ambos mundos!\n");
