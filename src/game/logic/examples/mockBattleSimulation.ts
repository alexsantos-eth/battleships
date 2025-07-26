import { BattleSimulator } from '../battleSimulator.js';
import type { BattleConfig, BattleInstruction } from '../battleSimulator.js';

export interface MockBattleResult {
  winner: 'player' | 'enemy';
  totalTurns: number;
  playerShots: number;
  enemyShots: number;
  playerHits: number;
  enemyHits: number;
  shipPlacements: {
    player: Array<{
      position: { x: number; y: number };
      variant: 'small' | 'medium' | 'large' | 'xlarge';
      orientation: 'horizontal' | 'vertical';
    }>;
    enemy: Array<{
      position: { x: number; y: number };
      variant: 'small' | 'medium' | 'large' | 'xlarge';
      orientation: 'horizontal' | 'vertical';
    }>;
  };
  shotHistory: Array<{
    turn: 'PLAYER_TURN' | 'ENEMY_TURN';
    position: { x: number; y: number };
    hit: boolean;
    shipDestroyed: boolean;
  }>;
}

export function createMockBattleWithPlayerWin(seed: number = 12345): MockBattleResult {
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
  
  // Barcos enemigos:
  // 1. Pequeño en [1,1] vertical: [1,1], [1,2] (2 celdas)
  // 2. Mediano en [3,3] horizontal: [3,3], [4,3], [5,3] (3 celdas)
  // 3. Grande en [6,6] vertical: [6,6], [6,7], [6,8], [6,9], [6,5] (5 celdas)
  // Total: 10 celdas a golpear
  
  // Estrategia: Disparar sistemáticamente a todas las posiciones hasta encontrar todos los barcos
  // Esto garantiza que el jugador encuentre todos los barcos enemigos
  const instructions: BattleInstruction[] = [
    // Disparar a todas las posiciones del tablero de manera sistemática
    // Fila 0
    { type: 'fire_shot', data: { position: { x: 0, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 7, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 0 } } },
    // Fila 1
    { type: 'fire_shot', data: { position: { x: 0, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 1 } } }, // Hit en barco pequeño
    { type: 'fire_shot', data: { position: { x: 2, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 7, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 1 } } },
    // Fila 2
    { type: 'fire_shot', data: { position: { x: 0, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 2 } } }, // Hit en barco pequeño
    { type: 'fire_shot', data: { position: { x: 2, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 7, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 2 } } },
    // Fila 3
    { type: 'fire_shot', data: { position: { x: 0, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 3 } } }, // Hit en barco mediano
    { type: 'fire_shot', data: { position: { x: 4, y: 3 } } }, // Hit en barco mediano
    { type: 'fire_shot', data: { position: { x: 5, y: 3 } } }, // Hit en barco mediano
    { type: 'fire_shot', data: { position: { x: 6, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 7, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 3 } } },
    // Fila 4
    { type: 'fire_shot', data: { position: { x: 0, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 7, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 4 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 4 } } },
    // Fila 5
    { type: 'fire_shot', data: { position: { x: 0, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 5 } } }, // Hit en barco grande
    { type: 'fire_shot', data: { position: { x: 7, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 5 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 5 } } },
    // Fila 6
    { type: 'fire_shot', data: { position: { x: 0, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 6 } } }, // Hit en barco grande
    { type: 'fire_shot', data: { position: { x: 7, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 6 } } },
    // Fila 7
    { type: 'fire_shot', data: { position: { x: 0, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 7 } } }, // Hit en barco grande
    { type: 'fire_shot', data: { position: { x: 7, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 7 } } },
    // Fila 8
    { type: 'fire_shot', data: { position: { x: 0, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 8 } } }, // Hit en barco grande
    { type: 'fire_shot', data: { position: { x: 7, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 8 } } },
    // Fila 9
    { type: 'fire_shot', data: { position: { x: 0, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 9 } } }, // Hit en barco grande
    { type: 'fire_shot', data: { position: { x: 7, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 8, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 9, y: 9 } } }
  ];

  const result = simulator.executeInstructions(instructions);
  
  return {
    winner: 'player',
    totalTurns: result.totalTurns,
    playerShots: result.playerShots,
    enemyShots: result.enemyShots,
    playerHits: result.playerHits,
    enemyHits: result.enemyHits,
    shipPlacements: result.shipPlacements,
    shotHistory: result.shotHistory
  };
}

export function createMockBattleWithEnemyWin(seed: number = 67890): MockBattleResult {
  const config: BattleConfig = {
    seed,
    boardWidth: 10,
    boardHeight: 10,
    playerShips: [
      { position: { x: 0, y: 0 }, variant: 'small', orientation: 'horizontal' },
      { position: { x: 2, y: 2 }, variant: 'medium', orientation: 'vertical' }
    ],
    enemyShips: [
      { position: { x: 1, y: 1 }, variant: 'small', orientation: 'vertical' },
      { position: { x: 3, y: 3 }, variant: 'medium', orientation: 'horizontal' },
      { position: { x: 5, y: 5 }, variant: 'large', orientation: 'horizontal' }
    ]
  };

  const simulator = new BattleSimulator(config);
  
  const instructions: BattleInstruction[] = [
    { type: 'fire_shot', data: { position: { x: 0, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 0 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 2, y: 4 } } }
  ];

  const result = simulator.executeInstructions(instructions);
  
  return {
    winner: 'enemy',
    totalTurns: result.totalTurns,
    playerShots: result.playerShots,
    enemyShots: result.enemyShots,
    playerHits: result.playerHits,
    enemyHits: result.enemyHits,
    shipPlacements: result.shipPlacements,
    shotHistory: result.shotHistory
  };
}

export function createRandomBattleSimulation(seed: number = 99999, maxShots: number = 15): MockBattleResult {
  const config: BattleConfig = {
    seed,
    boardWidth: 8,
    boardHeight: 8,
    playerShips: [
      { position: { x: 0, y: 0 }, variant: 'small', orientation: 'horizontal' },
      { position: { x: 2, y: 2 }, variant: 'medium', orientation: 'vertical' },
      { position: { x: 5, y: 1 }, variant: 'large', orientation: 'horizontal' }
    ],
    enemyShips: [
      { position: { x: 1, y: 1 }, variant: 'small', orientation: 'vertical' },
      { position: { x: 3, y: 3 }, variant: 'medium', orientation: 'horizontal' },
      { position: { x: 6, y: 6 }, variant: 'large', orientation: 'vertical' }
    ]
  };

  const simulator = new BattleSimulator(config);
  
  const instructions: BattleInstruction[] = [];
  const usedPositions = new Set<string>();
  
  for (let i = 0; i < maxShots; i++) {
    let x: number, y: number;
    let positionKey: string;
    
    // Generar posiciones únicas
    do {
      x = Math.floor(Math.random() * 8);
      y = Math.floor(Math.random() * 8);
      positionKey = `${x},${y}`;
    } while (usedPositions.has(positionKey));
    
    usedPositions.add(positionKey);
    instructions.push({ type: 'fire_shot', data: { position: { x, y } } });
  }

  const result = simulator.executeInstructions(instructions);
  
  return {
    winner: result.winner || 'enemy',
    totalTurns: result.totalTurns,
    playerShots: result.playerShots,
    enemyShots: result.enemyShots,
    playerHits: result.playerHits,
    enemyHits: result.enemyHits,
    shipPlacements: result.shipPlacements,
    shotHistory: result.shotHistory
  };
}

export function createQuickMockBattle(seed: number = 11111): MockBattleResult {
  const config: BattleConfig = {
    seed,
    boardWidth: 5,
    boardHeight: 5,
    playerShips: [
      { position: { x: 0, y: 0 }, variant: 'small', orientation: 'horizontal' }
    ],
    enemyShips: [
      { position: { x: 1, y: 1 }, variant: 'small', orientation: 'vertical' }
    ]
  };

  const simulator = new BattleSimulator(config);
  
  const instructions: BattleInstruction[] = [
    { type: 'fire_shot', data: { position: { x: 1, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 2 } } }
  ];

  const result = simulator.executeInstructions(instructions);
  
  return {
    winner: 'player',
    totalTurns: result.totalTurns,
    playerShots: result.playerShots,
    enemyShots: result.enemyShots,
    playerHits: result.playerHits,
    enemyHits: result.enemyHits,
    shipPlacements: result.shipPlacements,
    shotHistory: result.shotHistory
  };
}

export function runMockSimulation(type: 'player-win' | 'enemy-win' | 'quick' | 'random' = 'quick'): MockBattleResult {
  console.log(`🎯 Ejecutando simulación mock: ${type}`);
  
  let result: MockBattleResult;
  
  switch (type) {
    case 'player-win':
      result = createMockBattleWithPlayerWin();
      break;
    case 'enemy-win':
      result = createMockBattleWithEnemyWin();
      break;
    case 'random':
      result = createRandomBattleSimulation();
      break;
    case 'quick':
    default:
      result = createQuickMockBattle();
      break;
  }
  
  console.log('📊 Resultados de la simulación mock:');
  console.log(`🏆 Ganador: ${result.winner}`);
  console.log(`🔄 Total de turnos: ${result.totalTurns}`);
  console.log(`🎯 Disparos del jugador: ${result.playerShots} (${result.playerHits} aciertos)`);
  console.log(`🎯 Disparos del enemigo: ${result.enemyShots} (${result.enemyHits} aciertos)`);
  console.log(`📈 Precisión del jugador: ${((result.playerHits / result.playerShots) * 100).toFixed(1)}%`);
  console.log(`📈 Precisión del enemigo: ${((result.enemyHits / result.enemyShots) * 100).toFixed(1)}%`);
  
  console.log('\n🎯 Historial de disparos:');
  result.shotHistory.forEach((shot, index) => {
    console.log(`  ${index + 1}. ${shot.turn}: (${shot.position.x}, ${shot.position.y}) - ${shot.hit ? '✅ Hit' : '❌ Miss'}${shot.shipDestroyed ? ' 💥 Destroyed' : ''}`);
  });
  
  return result;
}