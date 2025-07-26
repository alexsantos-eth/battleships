import { BattleSimulator } from '../battleSimulator.js';
import type { BattleConfig, BattleInstruction } from '../battleSimulator.js';

export function simulateRandomBattle(seed: number = 12345) {
  console.log(`🎯 Simulando armada aleatoria con seed: ${seed}`);
  
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10
  };
  
  const simulator = new BattleSimulator(config);
  const result = simulator.simulateRandomBattle(50);
  
  console.log('📊 Resultados de la armada:');
  console.log(`🏆 Ganador: ${result.winner}`);
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  console.log(`🎯 Disparos del jugador: ${result.playerShots} (${result.playerHits} aciertos)`);
  console.log(`🎯 Disparos del enemigo: ${result.enemyShots} (${result.enemyHits} aciertos)`);
  console.log(`📈 Precisión del jugador: ${((result.playerHits / result.playerShots) * 100).toFixed(1)}%`);
  console.log(`📈 Precisión del enemigo: ${((result.enemyHits / result.enemyShots) * 100).toFixed(1)}%`);
  
  return result;
}

export function simulateCustomBattle(seed: number = 12345) {
  console.log(`🎯 Simulando armada personalizada con seed: ${seed}`);
  
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10,
    playerShips: [
      { position: { x: 0, y: 0 }, variant: 'small', orientation: 'horizontal' },
      { position: { x: 2, y: 2 }, variant: 'medium', orientation: 'vertical' },
      { position: { x: 5, y: 5 }, variant: 'large', orientation: 'horizontal' }
    ],
    enemyShips: [
      { position: { x: 1, y: 1 }, variant: 'small', orientation: 'vertical' },
      { position: { x: 3, y: 3 }, variant: 'medium', orientation: 'horizontal' },
      { position: { x: 6, y: 6 }, variant: 'xlarge', orientation: 'vertical' }
    ]
  };
  
  const simulator = new BattleSimulator(config);
  const result = simulator.simulateRandomBattle(30);
  
  console.log('📊 Resultados de la armada personalizada:');
  console.log(`🏆 Ganador: ${result.winner}`);
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  
  return result;
}

export function executeSpecificInstructions(seed: number = 12345) {
  console.log(`🎯 Ejecutando instrucciones específicas con seed: ${seed}`);
  
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10
  };
  
  const simulator = new BattleSimulator(config);
  
  const instructions: BattleInstruction[] = [
    {
      type: 'place_ship',
      data: {
        player: 'player',
        position: { x: 0, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      }
    },
    {
      type: 'fire_shot',
      data: { position: { x: 0, y: 0 } }
    },
    {
      type: 'fire_shot',
      data: { position: { x: 1, y: 1 } }
    },
    {
      type: 'fire_shot',
      data: { position: { x: 2, y: 2 } }
    }
  ];
  
  const result = simulator.executeInstructions(instructions);
  
  console.log('📊 Resultados de las instrucciones:');
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  console.log(`🎯 Historial de disparos:`);
  result.shotHistory.forEach((shot, index) => {
    console.log(`  ${index + 1}. ${shot.turn}: (${shot.position.x}, ${shot.position.y}) - ${shot.hit ? '✅ Hit' : '❌ Miss'}`);
  });
  
  return result;
}

export function compareSimulations(seeds: number[] = [12345, 67890]) {
  console.log('🔬 Comparando múltiples simulaciones...');
  
  const results = seeds.map(seed => {
    const config: BattleConfig = { seed, boardWidth: 10, boardHeight: 10 };
    const simulator = new BattleSimulator(config);
    return {
      seed,
      result: simulator.simulateRandomBattle(40)
    };
  });
  
  console.log('📊 Comparación de resultados:');
  results.forEach(({ seed, result }) => {
    console.log(`Seed ${seed}: Ganador=${result.winner}, Turnos=${result.totalTurns}, Precisión=${((result.playerHits / result.playerShots) * 100).toFixed(1)}%`);
  });
  
  return results;
}

export function analyzeStrategy(seed: number = 12345) {
  console.log(`🎯 Analizando estrategia con seed: ${seed}`);
  
  const config: BattleConfig = { seed, boardWidth: 10, boardHeight: 10 };
  
  const diagonalInstructions: BattleInstruction[] = [];
  for (let i = 0; i < 5; i++) {
    diagonalInstructions.push({
      type: 'fire_shot',
      data: { position: { x: i, y: i } }
    });
  }
  
  const simulator1 = new BattleSimulator(config);
  const diagonalResult = simulator1.executeInstructions(diagonalInstructions);
  
  const rowInstructions: BattleInstruction[] = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 5; x++) {
      rowInstructions.push({
        type: 'fire_shot',
        data: { position: { x, y } }
      });
    }
  }
  
  const simulator2 = new BattleSimulator(config);
  const rowResult = simulator2.executeInstructions(rowInstructions);
  
  console.log('📊 Análisis de estrategias:');
  console.log(`🔺 Estrategia diagonal: ${diagonalResult.playerHits} hits en ${diagonalResult.playerShots} disparos`);
  console.log(`📏 Estrategia por filas: ${rowResult.playerHits} hits en ${rowResult.playerShots} disparos`);
  
  return { diagonalResult, rowResult };
}

export function debugGameState(seed: number = 12345) {
  console.log(`🔍 Debug del estado del juego con seed: ${seed}`);
  
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10
  };
  
  const simulator = new BattleSimulator(config);
  const result = simulator.simulateRandomBattle(40);
  
  console.log('📊 Estado del juego:');
  console.log(`🏆 Ganador: ${result.winner}`);
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  console.log(`🎯 Disparos del jugador: ${result.playerShots} (${result.playerHits} aciertos)`);
  console.log(`🎯 Disparos del enemigo: ${result.enemyShots} (${result.enemyHits} aciertos)`);
  
  console.log('\n📋 Barcos colocados:');
  console.log(`Jugador: ${result.shipPlacements.player.length} barcos`);
  result.shipPlacements.player.forEach((ship, i) => {
    console.log(`  ${i + 1}. ${ship.variant} en (${ship.position.x}, ${ship.position.y}) ${ship.orientation}`);
  });
  
  console.log(`Enemigo: ${result.shipPlacements.enemy.length} barcos`);
  result.shipPlacements.enemy.forEach((ship, i) => {
    console.log(`  ${i + 1}. ${ship.variant} en (${ship.position.x}, ${ship.position.y}) ${ship.orientation}`);
  });
  
  console.log('\n🎯 Últimos 10 disparos:');
  result.shotHistory.slice(-10).forEach((shot, i) => {
    console.log(`  ${result.shotHistory.length - 9 + i}. ${shot.turn}: (${shot.position.x}, ${shot.position.y}) - ${shot.hit ? '✅ Hit' : '❌ Miss'}${shot.shipDestroyed ? ' 💥 Destroyed' : ''}`);
  });
  
  return result;
}

export function runAllExamples() {
  console.log('🚀 Ejecutando ejemplos del sistema determinista...\n');
  
  console.log('='.repeat(50));
  simulateRandomBattle(12345);
  
  console.log('\n' + '='.repeat(50));
  simulateCustomBattle(12345);
  
  console.log('\n' + '='.repeat(50));
  executeSpecificInstructions(12345);
  
  console.log('\n' + '='.repeat(50));
  compareSimulations([12345, 67890]);
  
  console.log('\n' + '='.repeat(50));
  analyzeStrategy(12345);
  
  console.log('\n' + '='.repeat(50));
  debugGameState(12345);
  
  console.log('\n✅ Todos los ejemplos completados!');
} 