import { runMockSimulation } from './mockBattleSimulation.js';

console.log('🎯 Probando simulaciones mock...\n');

console.log('='.repeat(50));
runMockSimulation('quick');

console.log('\n' + '='.repeat(50));
runMockSimulation('player-win');

console.log('\n' + '='.repeat(50));
runMockSimulation('enemy-win');

console.log('\n✅ Todas las simulaciones mock completadas!'); 