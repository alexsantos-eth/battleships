import { BattleSimulator } from '../battleSimulator';
import type { BattleConfig, BattleInstruction } from '../battleSimulator';

// Ejemplo 1: Simulación de batalla completamente aleatoria
export function simulateRandomBattle(seed: number = 12345) {
  console.log(`🎯 Simulando batalla aleatoria con seed: ${seed}`);
  
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10
  };
  
  const simulator = new BattleSimulator(config);
  const result = simulator.simulateRandomBattle(200);
  
  console.log('📊 Resultados de la batalla:');
  console.log(`🏆 Ganador: ${result.winner}`);
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  console.log(`🎯 Disparos del jugador: ${result.playerShots} (${result.playerHits} aciertos)`);
  console.log(`🎯 Disparos del enemigo: ${result.enemyShots} (${result.enemyHits} aciertos)`);
  console.log(`📈 Precisión del jugador: ${((result.playerHits / result.playerShots) * 100).toFixed(1)}%`);
  console.log(`📈 Precisión del enemigo: ${((result.enemyHits / result.enemyShots) * 100).toFixed(1)}%`);
  
  return result;
}

// Ejemplo 2: Simulación con barcos predefinidos
export function simulateCustomBattle(seed: number = 12345) {
  console.log(`🎯 Simulando batalla personalizada con seed: ${seed}`);
  
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
  const result = simulator.simulateRandomBattle(100);
  
  console.log('📊 Resultados de la batalla personalizada:');
  console.log(`🏆 Ganador: ${result.winner}`);
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  
  return result;
}

// Ejemplo 3: Ejecución de instrucciones específicas
export function executeSpecificInstructions(seed: number = 12345) {
  console.log(`🎯 Ejecutando instrucciones específicas con seed: ${seed}`);
  
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10
  };
  
  const simulator = new BattleSimulator(config);
  
  const instructions: BattleInstruction[] = [
    // Colocar un barco específico
    {
      type: 'place_ship',
      data: {
        player: 'player',
        position: { x: 0, y: 0 },
        variant: 'small',
        orientation: 'horizontal'
      }
    },
    // Disparar a posiciones específicas
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

// Ejemplo 4: Comparación de múltiples simulaciones
export function compareSimulations(seeds: number[] = [12345, 67890, 11111]) {
  console.log('🔬 Comparando múltiples simulaciones...');
  
  const results = seeds.map(seed => {
    const config: BattleConfig = { seed, boardWidth: 10, boardHeight: 10 };
    const simulator = new BattleSimulator(config);
    return {
      seed,
      result: simulator.simulateRandomBattle(100)
    };
  });
  
  console.log('📊 Comparación de resultados:');
  results.forEach(({ seed, result }) => {
    console.log(`Seed ${seed}: Ganador=${result.winner}, Turnos=${result.totalTurns}, Precisión=${((result.playerHits / result.playerShots) * 100).toFixed(1)}%`);
  });
  
  // Verificar determinismo
  const sameSeedResults = results.filter(r => r.seed === 12345);
  if (sameSeedResults.length > 1) {
    const isDeterministic = sameSeedResults.every(r => 
      r.result.winner === sameSeedResults[0].result.winner &&
      r.result.totalTurns === sameSeedResults[0].result.totalTurns
    );
    console.log(`✅ Determinismo verificado: ${isDeterministic ? 'PASÓ' : 'FALLÓ'}`);
  }
  
  return results;
}

// Ejemplo 5: Análisis de estrategias
export function analyzeStrategy(seed: number = 12345) {
  console.log(`🎯 Analizando estrategia con seed: ${seed}`);
  
  const config: BattleConfig = { seed, boardWidth: 10, boardHeight: 10 };
  const simulator = new BattleSimulator(config);
  
  // Estrategia 1: Disparar en diagonal
  const diagonalInstructions: BattleInstruction[] = [];
  for (let i = 0; i < 10; i++) {
    diagonalInstructions.push({
      type: 'fire_shot',
      data: { position: { x: i, y: i } }
    });
  }
  
  const diagonalResult = simulator.executeInstructions(diagonalInstructions);
  
  // Estrategia 2: Disparar en filas
  const rowInstructions: BattleInstruction[] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 10; x++) {
      rowInstructions.push({
        type: 'fire_shot',
        data: { position: { x, y } }
      });
    }
  }
  
  const rowResult = simulator.executeInstructions(rowInstructions);
  
  console.log('📊 Análisis de estrategias:');
  console.log(`🔺 Estrategia diagonal: ${diagonalResult.playerHits} hits en ${diagonalResult.playerShots} disparos`);
  console.log(`📏 Estrategia por filas: ${rowResult.playerHits} hits en ${rowResult.playerShots} disparos`);
  
  return { diagonalResult, rowResult };
}

// Función principal para ejecutar todos los ejemplos
export function runAllExamples() {
  console.log('🚀 Ejecutando ejemplos del sistema determinista...\n');
  
  console.log('='.repeat(50));
  simulateRandomBattle(12345);
  
  console.log('\n' + '='.repeat(50));
  simulateCustomBattle(12345);
  
  console.log('\n' + '='.repeat(50));
  executeSpecificInstructions(12345);
  
  console.log('\n' + '='.repeat(50));
  compareSimulations([12345, 67890, 11111]);
  
  console.log('\n' + '='.repeat(50));
  analyzeStrategy(12345);
  
  console.log('\n✅ Todos los ejemplos completados!');
} 