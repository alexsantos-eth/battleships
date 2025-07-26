import { runMockSimulation } from './mockBattleSimulation.js';

console.log('🎬 Probando simulación visual completa...\n');

console.log('='.repeat(50));
console.log('⚡ Simulación Rápida (2 turnos):');
const quickResult = runMockSimulation('quick');
console.log(`✅ Ganador: ${quickResult.winner}`);
console.log(`✅ Turnos: ${quickResult.totalTurns}`);
console.log(`✅ Disparos del jugador: ${quickResult.playerShots}`);
console.log(`✅ Disparos del enemigo: ${quickResult.enemyShots}`);
console.log('📋 Historial de disparos:');
quickResult.shotHistory.forEach((shot, index) => {
  const player = shot.turn === 'PLAYER_TURN' ? '👤 Jugador' : '🤖 Enemigo';
  const result = shot.hit ? '✅ Hit' : '❌ Miss';
  console.log(`  ${index + 1}. ${player}: (${shot.position.x}, ${shot.position.y}) - ${result}`);
});

console.log('\n' + '='.repeat(50));
console.log('👤 Simulación Jugador Gana (10 turnos):');
const playerWinResult = runMockSimulation('player-win');
console.log(`✅ Ganador: ${playerWinResult.winner}`);
console.log(`✅ Turnos: ${playerWinResult.totalTurns}`);
console.log(`✅ Disparos del jugador: ${playerWinResult.playerShots}`);
console.log(`✅ Disparos del enemigo: ${playerWinResult.enemyShots}`);

console.log('\n' + '='.repeat(50));
console.log('🤖 Simulación Enemigo Gana (5 turnos):');
const enemyWinResult = runMockSimulation('enemy-win');
console.log(`✅ Ganador: ${enemyWinResult.winner}`);
console.log(`✅ Turnos: ${enemyWinResult.totalTurns}`);
console.log(`✅ Disparos del jugador: ${enemyWinResult.playerShots}`);
console.log(`✅ Disparos del enemigo: ${enemyWinResult.enemyShots}`);

console.log('\n✅ Todas las simulaciones están listas para visualización!');
console.log('🎯 Ahora puedes probar la simulación visual en la UI de debug.');
console.log('📊 Deberías ver:');
console.log('  - Disparos del jugador en el tablero enemigo (azul)');
console.log('  - Disparos del enemigo en el tablero del jugador (rojo)');
console.log('  - Explosiones de agua para los hits');
console.log('  - Progreso en tiempo real'); 