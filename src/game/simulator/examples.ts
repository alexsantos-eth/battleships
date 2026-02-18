/**
 * Ejemplos de uso del simulador de batallas
 * 
 * Este archivo muestra cómo usar el BattleSimulator para simular partidas
 * sin actualizar la UI, útil para:
 * - Testing automatizado
 * - Generación de estadísticas
 * - Entrenamiento de IA
 * - Análisis de balance del juego
 */

import { 
  BattleSimulator, 
  simulateSingleGame, 
  simulateMultipleGames 
} from "./battleSimulator";

// ============================================================================
// EJEMPLO 1: Simular una partida simple
// ============================================================================
export function example1_SingleGame() {
  console.log("=== Ejemplo 1: Simular una partida ===");
  
  const result = simulateSingleGame();
  
  console.log(`Ganador: ${result.winner || "Empate"}`);
  console.log(`Total de turnos: ${result.totalTurns}`);
  console.log(`Disparos del jugador: ${result.playerShots} (${result.playerHits} impactos)`);
  console.log(`Disparos del enemigo: ${result.enemyShots} (${result.enemyHits} impactos)`);
  console.log(`Precisión jugador: ${((result.playerHits / result.playerShots) * 100).toFixed(2)}%`);
  console.log(`Precisión enemigo: ${((result.enemyHits / result.enemyShots) * 100).toFixed(2)}%`);
  
  return result;
}

// ============================================================================
// EJEMPLO 2: Simular con configuración personalizada
// ============================================================================
export function example2_CustomConfig() {
  console.log("\n=== Ejemplo 2: Partida con tablero personalizado ===");
  
  const result = simulateSingleGame({
    boardWidth: 12,
    boardHeight: 12,
    shipCounts: {
      small: 2,
      medium: 3,
      large: 2,
      xlarge: 1,
    },
    initialTurn: "player",
  });
  
  console.log(`Ganador: ${result.winner}`);
  console.log(`Total de turnos: ${result.totalTurns}`);
  console.log(`Barcos del jugador:`, result.shipPlacements.player.length);
  console.log(`Barcos del enemigo:`, result.shipPlacements.enemy.length);
  
  return result;
}

// ============================================================================
// EJEMPLO 3: Simular múltiples partidas para estadísticas
// ============================================================================
export function example3_MultipleGames() {
  console.log("\n=== Ejemplo 3: Simulando 1000 partidas ===");
  
  const { results, stats } = simulateMultipleGames(1000, {
    boardWidth: 10,
    boardHeight: 10,
    initialTurn: "random",
  });
  
  console.log("\n=== ESTADÍSTICAS ===");
  console.log(`Total de partidas: ${results.length}`);
  console.log(`Victorias del jugador: ${stats.playerWins} (${((stats.playerWins / results.length) * 100).toFixed(2)}%)`);
  console.log(`Victorias del enemigo: ${stats.enemyWins} (${((stats.enemyWins / results.length) * 100).toFixed(2)}%)`);
  console.log(`Empates: ${stats.draws}`);
  console.log(`Promedio de turnos por partida: ${stats.avgTurns.toFixed(2)}`);
  console.log(`Promedio de impactos del jugador: ${stats.avgPlayerHits.toFixed(2)}`);
  console.log(`Promedio de impactos del enemigo: ${stats.avgEnemyHits.toFixed(2)}`);
  console.log(`Precisión promedio del jugador: ${stats.avgPlayerAccuracy.toFixed(2)}%`);
  console.log(`Precisión promedio del enemigo: ${stats.avgEnemyAccuracy.toFixed(2)}%`);
  
  return { results, stats };
}

// ============================================================================
// EJEMPLO 4: Usar la clase directamente para control avanzado
// ============================================================================
export function example4_AdvancedControl() {
  console.log("\n=== Ejemplo 4: Control avanzado con la clase ===");
  
  const simulator = new BattleSimulator({
    boardWidth: 10,
    boardHeight: 10,
    shipCounts: {
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 1,
    },
  });
  
  // Simular primera partida
  const result1 = simulator.simulate();
  console.log(`Partida 1 - Ganador: ${result1.winner}, Turnos: ${result1.totalTurns}`);
  
  // Simular segunda partida con los mismos barcos
  const state = simulator.getState();
  const result2 = simulator.simulate({
    playerShips: state.playerShips,
    enemyShips: state.enemyShips,
  });
  console.log(`Partida 2 (mismos barcos) - Ganador: ${result2.winner}, Turnos: ${result2.totalTurns}`);
  
  return { result1, result2 };
}

// ============================================================================
// EJEMPLO 5: Analizar historial de disparos
// ============================================================================
export function example5_ShotHistory() {
  console.log("\n=== Ejemplo 5: Análisis del historial de disparos ===");
  
  const result = simulateSingleGame();
  
  console.log(`\nPrimeros 10 disparos:`);
  result.shotHistory.slice(0, 10).forEach((shot, index) => {
    const isPlayer = shot.turn === "PLAYER_TURN";
    const player = isPlayer ? "Jugador" : "Enemigo";
    const hitStatus = shot.hit ? "¡IMPACTO!" : "Agua";
    console.log(`${index + 1}. ${player} dispara a (${shot.x}, ${shot.y}) - ${hitStatus}`);
  });
  
  // Encontrar cuántos turnos tomó hundir el primer barco
  const firstDestroyedShip = result.shotHistory.findIndex((shot, index) => {
    if (!shot.hit || !shot.shipId) return false;
    
    const shotsOnThisShip = result.shotHistory
      .slice(0, index + 1)
      .filter(s => s.shipId === shot.shipId);
    
    // Verificar si es el último hit necesario
    return shotsOnThisShip.length >= 2; // Mínimo para ship "small"
  });
  
  if (firstDestroyedShip >= 0) {
    console.log(`\nPrimer barco hundido en el turno ${firstDestroyedShip + 1}`);
  }
  
  return result;
}

// ============================================================================
// EJEMPLO 6: Comparar diferentes configuraciones
// ============================================================================
export function example6_CompareConfigs() {
  console.log("\n=== Ejemplo 6: Comparar configuraciones ===");
  
  const configs = [
    { name: "Estándar 10x10", config: { boardWidth: 10, boardHeight: 10 } },
    { name: "Grande 15x15", config: { boardWidth: 15, boardHeight: 15 } },
    { name: "Pequeño 5x5", config: { boardWidth: 5, boardHeight: 5, shipCounts: { small: 1, medium: 1, large: 0, xlarge: 0 } } },
  ];
  
  configs.forEach(({ name, config }) => {
    const { stats } = simulateMultipleGames(100, config);
    console.log(`\n${name}:`);
    console.log(`  Promedio de turnos: ${stats.avgTurns.toFixed(2)}`);
    console.log(`  Precisión del jugador: ${stats.avgPlayerAccuracy.toFixed(2)}%`);
    console.log(`  Balance (% victorias jugador): ${((stats.playerWins / 100) * 100).toFixed(2)}%`);
  });
}

// ============================================================================
// FUNCIÓN PARA EJECUTAR TODOS LOS EJEMPLOS
// ============================================================================
export function runAllExamples() {
  example1_SingleGame();
  example2_CustomConfig();
  example3_MultipleGames();
  example4_AdvancedControl();
  example5_ShotHistory();
  example6_CompareConfigs();
}

// Para usar en la consola del navegador o Node.js:
// import { runAllExamples } from '@/game/simulator/examples';
// runAllExamples();
