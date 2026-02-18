/**
 * Test de Equivalencia: GameEngine vs FastGameEngine
 *
 * Verifica que ambos engines producen resultados idénticos
 */

import {
  GameEngine,
  FastGameEngine,
  GameInitializer,
  type GameShip,
} from "../engine";

/**
 * Ejecutar la misma secuencia de disparos en ambos engines
 */
function testEquivalence(
  playerShips: GameShip[],
  enemyShips: GameShip[],
  shots: Array<{ x: number; y: number; isPlayerShot: boolean }>,
): { passed: boolean; details: string } {
  const config = { boardWidth: 5, boardHeight: 5 };

  // Engine normal
  const gameEngine = new GameEngine(config);
  gameEngine.initializeGame(playerShips, enemyShips, "PLAYER_TURN");

  // Engine rápido
  const fastEngine = new FastGameEngine(config);
  fastEngine.initializeGame(playerShips, enemyShips, "PLAYER_TURN");

  // Ejecutar la misma secuencia
  for (let i = 0; i < shots.length; i++) {
    const { x, y, isPlayerShot } = shots[i];

    const normalResult = gameEngine.executeShot(x, y, isPlayerShot);
    const fastResult = fastEngine.executeShot(x, y, isPlayerShot);

    // Verificar que los resultados sean idénticos
    if (
      normalResult.success !== fastResult.success ||
      normalResult.hit !== fastResult.hit ||
      normalResult.shipId !== fastResult.shipId ||
      normalResult.shipDestroyed !== fastResult.shipDestroyed ||
      normalResult.isGameOver !== fastResult.isGameOver ||
      normalResult.winner !== fastResult.winner
    ) {
      return {
        passed: false,
        details: `Disparo ${i + 1} (${x}, ${y}): Resultados diferentes
          GameEngine:     ${JSON.stringify(normalResult)}
          FastGameEngine: ${JSON.stringify(fastResult)}`,
      };
    }
  }

  // Verificar estados finales
  const normalState = gameEngine.getState();
  const fastState = fastEngine.getStateUnsafe();

  if (
    normalState.isGameOver !== fastState.isGameOver ||
    normalState.winner !== fastState.winner ||
    normalState.shotCount !== fastState.shotCount ||
    normalState.currentTurn !== fastState.currentTurn
  ) {
    return {
      passed: false,
      details: `Estados finales diferentes:
        GameEngine:     ${JSON.stringify({
          isGameOver: normalState.isGameOver,
          winner: normalState.winner,
          shotCount: normalState.shotCount,
          currentTurn: normalState.currentTurn,
        })}
        FastGameEngine: ${JSON.stringify({
          isGameOver: fastState.isGameOver,
          winner: fastState.winner,
          shotCount: fastState.shotCount,
          currentTurn: fastState.currentTurn,
        })}`,
    };
  }

  return { passed: true, details: "✓ Todos los resultados son idénticos" };
}

/**
 * Ejecutar múltiples tests de equivalencia
 */
export function runEquivalenceTests(numTests: number = 100): void {
  console.log("\n🧪 TEST DE EQUIVALENCIA: GameEngine vs FastGameEngine\n");
  console.log("━".repeat(60));

  const initializer = new GameInitializer();
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < numTests; i++) {
    const setup = initializer.initializeGame();

    // Generar secuencia aleatoria de disparos
    const shots: Array<{ x: number; y: number; isPlayerShot: boolean }> = [];
    const maxShots = 30; // Suficiente para probar

    for (let j = 0; j < maxShots; j++) {
      const x = Math.floor(Math.random() * 5);
      const y = Math.floor(Math.random() * 5);
      const isPlayerShot = Math.random() > 0.5;
      shots.push({ x, y, isPlayerShot });
    }

    const result = testEquivalence(setup.playerShips, setup.enemyShips, shots);

    if (result.passed) {
      passed++;
      console.log(`✓ Tests pasados: ${passed}/${i + 1}`);
    } else {
      failed++;
      console.log(`\n❌ Test ${i + 1} FALLÓ:`);
      console.log(result.details);
    }
  }

  console.log("\n\n📊 RESULTADOS:\n");
  console.log(`Total tests:     ${numTests}`);
  console.log(
    `✓ Pasados:       ${passed} (${((passed / numTests) * 100).toFixed(1)}%)`,
  );
  console.log(
    `❌ Fallidos:     ${failed} (${((failed / numTests) * 100).toFixed(1)}%)`,
  );

  if (failed === 0) {
    console.log("\n🎉 ¡Todos los tests pasaron!");
    console.log("   FastGameEngine es funcionalmente equivalente a GameEngine");
  } else {
    console.log("\n⚠️  Algunos tests fallaron");
    console.log("   Revisar implementación de FastGameEngine");
  }

  console.log("\n" + "━".repeat(60) + "\n");
}

/**
 * Test específico: Juego completo determinístico
 */
export function testCompleteDeterministicGame(): void {
  console.log("\n🎯 TEST DETERMINÍSTICO: Juego Completo\n");

  const playerShips: GameShip[] = [
    { coords: [0, 0], orientation: "horizontal", variant: "small" },
  ];

  const enemyShips: GameShip[] = [
    { coords: [4, 4], orientation: "horizontal", variant: "small" },
  ];

  // Secuencia de disparos que destruye el barco enemigo
  const shots = [
    { x: 4, y: 4, isPlayerShot: true }, // HIT
    { x: 3, y: 4, isPlayerShot: true }, // MISS (fuera del barco)
    { x: 0, y: 0, isPlayerShot: false }, // HIT (enemigo)
    { x: 4, y: 5, isPlayerShot: true }, // HIT (destruye barco)
  ];

  const result = testEquivalence(playerShips, enemyShips, shots);

  if (result.passed) {
    console.log("✓ Test determinístico PASÓ");
    console.log(result.details);
  } else {
    console.log("❌ Test determinístico FALLÓ");
    console.log(result.details);
  }

  console.log();
}
