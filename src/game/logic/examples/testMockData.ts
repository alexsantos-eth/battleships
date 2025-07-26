import { createMockBattleWithPlayerWin } from './mockBattleSimulation.js';

console.log('🧪 Probando datos del mock "player wins"...\n');

const result = createMockBattleWithPlayerWin();

console.log('📊 Resultado de la simulación:');
console.log(`Ganador: ${result.winner}`);
console.log(`Turnos totales: ${result.totalTurns}`);
console.log(`Disparos del jugador: ${result.playerShots}`);
console.log(`Hits del jugador: ${result.playerHits}`);
console.log(`Disparos del enemigo: ${result.enemyShots}`);
console.log(`Hits del enemigo: ${result.enemyHits}\n`);

console.log('🚢 Barcos enemigos colocados:');
result.shipPlacements.enemy.forEach((ship, index) => {
  console.log(`  Barco ${index + 1}: Posición [${ship.position.x}, ${ship.position.y}], Variante: ${ship.variant}, Orientación: ${ship.orientation}`);
});

console.log('\n🎯 Historial completo de disparos:');
result.shotHistory.forEach((shot, index) => {
  console.log(`  ${index + 1}. ${shot.turn}: [${shot.position.x}, ${shot.position.y}] - ${shot.hit ? 'HIT' : 'MISS'} - ${shot.shipDestroyed ? 'BARCO DESTRUIDO' : ''}`);
});

console.log('\n🎯 Historial de disparos del jugador:');
result.shotHistory.forEach((shot, index) => {
  if (shot.turn === 'PLAYER_TURN') {
    console.log(`  Disparo ${index + 1}: [${shot.position.x}, ${shot.position.y}] - ${shot.hit ? 'HIT' : 'MISS'} - ${shot.shipDestroyed ? 'BARCO DESTRUIDO' : ''}`);
  }
});

console.log('\n✅ Verificación de hits:');
let hitsCount = 0;
result.shotHistory.forEach((shot) => {
  if (shot.turn === 'PLAYER_TURN' && shot.hit) {
    hitsCount++;
    console.log(`  Hit ${hitsCount}: [${shot.position.x}, ${shot.position.y}]`);
  }
});

console.log(`\n🎯 Total de hits del jugador: ${hitsCount}`);
console.log(`🎯 Hits esperados: ${result.playerHits}`);

if (hitsCount === result.playerHits) {
  console.log('✅ Los datos del mock son consistentes!');
} else {
  console.log('❌ Hay inconsistencia en los datos del mock!');
} 