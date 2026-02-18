/**
 * Script de demostración rápida del simulador
 * 
 * Para ejecutar en la consola del navegador:
 * 
 * import { quickDemo } from '@/game/simulator/quickDemo';
 * quickDemo();
 */

import { simulateSingleGame, simulateMultipleGames } from './battleSimulator';

export function quickDemo() {
  console.clear();
  console.log('🎮 SIMULADOR DE BATALLAS - DEMOSTRACIÓN RÁPIDA\n');
  console.log('='.repeat(60));
  
  // Demo 1: Una partida
  console.log('\n📊 SIMULANDO 1 PARTIDA...\n');
  const single = simulateSingleGame();
  console.log(`🏆 Ganador: ${single.winner?.toUpperCase() || 'EMPATE'}`);
  console.log(`⏱️  Turnos totales: ${single.totalTurns}`);
  console.log(`🎯 Jugador: ${single.playerShots} disparos, ${single.playerHits} impactos (${((single.playerHits/single.playerShots)*100).toFixed(1)}%)`);
  console.log(`🎯 Enemigo: ${single.enemyShots} disparos, ${single.enemyHits} impactos (${((single.enemyHits/single.enemyShots)*100).toFixed(1)}%)`);
  
  // Primeros 5 disparos
  console.log('\n📜 Primeros 5 disparos:');
  single.shotHistory.slice(0, 5).forEach((shot, i) => {
    const player = shot.turn === 'PLAYER_TURN' ? 'Jugador' : 'Enemigo';
    const result = shot.hit ? '💥 HIT' : '💦 Miss';
    console.log(`  ${i+1}. ${player} → (${shot.x}, ${shot.y}) ${result}`);
  });
  
  // Demo 2: Múltiples partidas
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SIMULANDO 1000 PARTIDAS...\n');
  
  const start = performance.now();
  const { stats } = simulateMultipleGames(1000);
  const duration = performance.now() - start;
  
  console.log(`✅ Completado en ${duration.toFixed(2)}ms (${(duration/1000).toFixed(3)}ms por partida)`);
  console.log(`\n🏆 RESULTADOS:`);
  console.log(`   Victorias Jugador: ${stats.playerWins} (${((stats.playerWins/1000)*100).toFixed(1)}%)`);
  console.log(`   Victorias Enemigo: ${stats.enemyWins} (${((stats.enemyWins/1000)*100).toFixed(1)}%)`);
  console.log(`   Empates: ${stats.draws} (${((stats.draws/1000)*100).toFixed(1)}%)`);
  console.log(`\n📈 ESTADÍSTICAS:`);
  console.log(`   Promedio de turnos: ${stats.avgTurns.toFixed(2)}`);
  console.log(`   Precisión Jugador: ${stats.avgPlayerAccuracy.toFixed(2)}%`);
  console.log(`   Precisión Enemigo: ${stats.avgEnemyAccuracy.toFixed(2)}%`);
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ DEMOSTRACIÓN COMPLETADA\n');
  console.log('💡 Puedes usar estas funciones:');
  console.log('   - simulateSingleGame()');
  console.log('   - simulateMultipleGames(n)');
  console.log('   - new BattleSimulator(config)');
  console.log('\n📖 Más info: src/game/simulator/README.md\n');
  
  return { single, stats };
}

// También exportar una versión más detallada
export function detailedDemo() {
  console.clear();
  console.log('🎮 SIMULADOR DE BATALLAS - DEMOSTRACIÓN DETALLADA\n');
  
  const configs = [
    { name: 'Pequeño 5x5', config: { boardWidth: 5, boardHeight: 5, shipCounts: { small: 1, medium: 1, large: 0, xlarge: 0 } } },
    { name: 'Estándar 10x10', config: { boardWidth: 10, boardHeight: 10 } },
    { name: 'Grande 15x15', config: { boardWidth: 15, boardHeight: 15 } },
  ];
  
  console.log('📊 Comparando diferentes configuraciones (100 partidas cada una)...\n');
  
  const results = configs.map(({ name, config }) => {
    const start = performance.now();
    const { stats } = simulateMultipleGames(100, config);
    const duration = performance.now() - start;
    
    console.log(`${name}:`);
    console.log(`  ⏱️  Tiempo: ${duration.toFixed(2)}ms`);
    console.log(`  🏆 Balance: ${stats.playerWins}P / ${stats.enemyWins}E / ${stats.draws}D`);
    console.log(`  📊 Promedio turnos: ${stats.avgTurns.toFixed(2)}`);
    console.log(`  🎯 Precisión promedio: ${stats.avgPlayerAccuracy.toFixed(2)}%`);
    console.log('');
    
    return { name, stats, duration };
  });
  
  console.log('✨ Demostración completada\n');
  
  return results;
}

// Auto-ejecutar si se importa directamente
if (typeof window !== 'undefined') {
  (window as any).quickDemo = quickDemo;
  (window as any).detailedDemo = detailedDemo;
  console.log('💡 Funciones disponibles: quickDemo() y detailedDemo()');
}
