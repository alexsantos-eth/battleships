import { runMockSimulation } from './mockBattleSimulation.js';

console.log('🎬 Probando simulación visual...\n');

console.log('='.repeat(50));
console.log('⚡ Simulación Rápida:');
const quickResult = runMockSimulation('quick');
console.log(`✅ Ganador: ${quickResult.winner}`);
console.log(`✅ Turnos: ${quickResult.totalTurns}`);
console.log(`✅ Disparos: ${quickResult.shotHistory.length}`);

console.log('\n' + '='.repeat(50));
console.log('👤 Simulación Jugador Gana:');
const playerWinResult = runMockSimulation('player-win');
console.log(`✅ Ganador: ${playerWinResult.winner}`);
console.log(`✅ Turnos: ${playerWinResult.totalTurns}`);
console.log(`✅ Disparos: ${playerWinResult.shotHistory.length}`);

console.log('\n' + '='.repeat(50));
console.log('🤖 Simulación Enemigo Gana:');
const enemyWinResult = runMockSimulation('enemy-win');
console.log(`✅ Ganador: ${enemyWinResult.winner}`);
console.log(`✅ Turnos: ${enemyWinResult.totalTurns}`);
console.log(`✅ Disparos: ${enemyWinResult.shotHistory.length}`);

console.log('\n✅ Todas las simulaciones visuales están listas!');
console.log('🎯 Ahora puedes probar la simulación visual en la UI de debug.'); 