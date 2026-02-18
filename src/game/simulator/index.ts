/**
 * Simulador de partidas de Armada
 * 
 * Este módulo permite simular partidas completas sin actualizar la UI,
 * útil para testing, estadísticas y análisis.
 */

export { 
  BattleSimulator,
  simulateSingleGame,
  simulateMultipleGames,
} from './battleSimulator';

export {
  example1_SingleGame,
  example2_CustomConfig,
  example3_MultipleGames,
  example4_AdvancedControl,
  example5_ShotHistory,
  example6_CompareConfigs,
  runAllExamples,
} from './examples';

export {
  quickDemo,
  detailedDemo,
} from './quickDemo';
