/**
 * Motor del Juego - Librería independiente de lógica de batalla naval
 * 
 * Esta librería contiene toda la lógica del juego completamente aislada de:
 * - React/Zustand (state management de UI)
 * - Three.js (renderizado 3D)  
 * - Event buses (eventos de cámara)
 * - Hooks de React
 * 
 * Puede ser usada para:
 * - Implementaciones de UI (React, Vue, Angular, etc.)
 * - Simulaciones headless
 * - Testing automatizado
 * - Servidores de juego
 * - Herramientas de análisis
 * 
 * @see README.md - Documentación completa
 * @see QUICK_START.md - Guía rápida de inicio
 * @see PORTABILITY_GUIDE.md - Guía para mover a un nuevo proyecto
 * @see standalone.ts - Versión todo-en-uno
 * @see migrate-engine.js - Script de migración automática
 */

export { GameEngine } from './GameEngine';
export type { 
  GameEngineState, 
  ShotResult,
  GameEngineCallbacks 
} from './GameEngine';

export { AIPlayer, SmartAIPlayer } from './AIPlayer';

// Ejemplos de uso
export {
  example1_BasicGameWithAI,
  example2_WithCallbacks,
  example3_SmartAIvsRandomAI,
  example4_MultipleGames,
  example5_InspectGameState,
  example6_ReplayGame,
  runAllEngineExamples,
} from './examples';

// Re-exportar tipos comunes para conveniencia
export type { 
  GameShip, 
  Shot, 
  Winner, 
  GameTurn,
  ShipVariant,
  ShipOrientation 
} from '@/types/game/common';

export type { GameConfig } from '@/types/game/config';
