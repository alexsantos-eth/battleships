import { runMockSimulation } from './mockBattleSimulation.js';

console.log('🎲 Probando simulación aleatoria...\n');

const result = runMockSimulation('random');

console.log('\n✅ Simulación aleatoria completada exitosamente!');
console.log(`🎯 Resultado: ${result.winner === 'player' ? 'Jugador gana' : 'Enemigo gana'}`);
console.log(`📊 Estadísticas:`);
console.log(`   - Turnos totales: ${result.totalTurns}`);
console.log(`   - Disparos del jugador: ${result.playerShots} (${result.playerHits} aciertos)`);
console.log(`   - Disparos del enemigo: ${result.enemyShots} (${result.enemyHits} aciertos)`);
console.log(`   - Precisión jugador: ${((result.playerHits / result.playerShots) * 100).toFixed(1)}%`);
console.log(`   - Precisión enemigo: ${((result.enemyHits / result.enemyShots) * 100).toFixed(1)}%`); 