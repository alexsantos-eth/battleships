import { runAllExamples } from './deterministicBattleExample';

// Ejecutar todos los ejemplos
console.log('🎯 Sistema Determinista de Batalla Naval');
console.log('=====================================\n');

try {
  runAllExamples();
} catch (error) {
  console.error('❌ Error ejecutando ejemplos:', error);
} 