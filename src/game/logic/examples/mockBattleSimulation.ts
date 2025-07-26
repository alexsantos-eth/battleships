import { BattleSimulator } from '../battleSimulator.js';
import type { BattleConfig, BattleInstruction } from '../battleSimulator.js';

export interface MockBattleResult {
  winner: 'player' | 'enemy';
  totalTurns: number;
  playerShots: number;
  enemyShots: number;
  playerHits: number;
  enemyHits: number;
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
  
  const instructions: BattleInstruction[] = [
    { type: 'fire_shot', data: { position: { x: 1, y: 1 } } },
    { type: 'fire_shot', data: { position: { x: 1, y: 2 } } },
    { type: 'fire_shot', data: { position: { x: 3, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 4, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 5, y: 3 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 6 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 7 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 8 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 9 } } },
    { type: 'fire_shot', data: { position: { x: 6, y: 10 } } }
  ];

  const result = simulator.executeInstructions(instructions);
  
  return {
    winner: 'player',
    totalTurns: result.totalTurns,
    playerShots: result.playerShots,
    enemyShots: result.enemyShots,
    playerHits: result.playerHits,
    enemyHits: result.enemyHits,
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
    shotHistory: result.shotHistory
  };
}

export function runMockSimulation(type: 'player-win' | 'enemy-win' | 'quick' = 'quick'): MockBattleResult {
  console.log(`🎯 Ejecutando simulación mock: ${type}`);
  
  let result: MockBattleResult;
  
  switch (type) {
    case 'player-win':
      result = createMockBattleWithPlayerWin();
      break;
    case 'enemy-win':
      result = createMockBattleWithEnemyWin();
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