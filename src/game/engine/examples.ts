/**
 * Ejemplos de uso del GameEngine
 * 
 * Estos ejemplos demuestran cómo usar la librería del motor de juego
 * en diferentes contextos y para diferentes propósitos.
 */

import { GameEngine, AIPlayer, SmartAIPlayer } from '@/game/engine';
import { generateShips } from '@/tools/ship/calculations';
import type { GameConfig } from '@/types/game/config';

// ============================================================================
// EJEMPLO 1: Juego Básico con IA
// ============================================================================

export function example1_BasicGameWithAI() {
  console.log('=== EJEMPLO 1: Juego Básico con IA ===\n');

  // Crear motor
  const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });

  // Generar barcos
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });

  // Inicializar juego
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  // Crear IA
  const ai = new AIPlayer(engine);

  console.log('Partida iniciada!');
  console.log(`Barcos del jugador: ${playerShips.length}`);
  console.log(`Barcos del enemigo: ${enemyShips.length}\n`);

  // Simular algunos turnos
  let turnCount = 0;
  const maxTurns = 10;

  while (turnCount < maxTurns && !engine.getState().isGameOver) {
    if (engine.isPlayerTurn()) {
      // Disparo aleatorio del jugador
      const position = ai.generateRandomShot();
      if (position) {
        const [x, y] = position;
        const result = engine.executeShot(x, y, true);
        console.log(`Turno ${turnCount + 1} - Jugador dispara a (${x}, ${y}): ${result.hit ? '💥 HIT' : '💦 MISS'}`);
        
        if (!result.shipDestroyed) {
          engine.toggleTurn();
        }
      }
    } else {
      // Turno de la IA
      const result = ai.executeTurn();
      if (result) {
        const [x, y] = result.position!;
        console.log(`Turno ${turnCount + 1} - IA dispara a (${x}, ${y}): ${result.hit ? '💥 HIT' : '💦 MISS'}`);
        
        if (!result.shipDestroyed) {
          engine.toggleTurn();
        }
      }
    }
    
    turnCount++;
  }

  const state = engine.getState();
  console.log(`\n Resultado después de ${turnCount} turnos:`);
  console.log(`Disparos del jugador: ${state.playerShots.length}`);
  console.log(`Disparos de la IA: ${state.enemyShots.length}`);
  console.log(`Juego terminado: ${state.isGameOver ? 'Sí' : 'No'}`);
  if (state.isGameOver) {
    console.log(`Ganador: ${state.winner?.toUpperCase()}`);
  }

  return state;
}

// ============================================================================
// EJEMPLO 2: Uso con Callbacks para Observar Eventos
// ============================================================================

export function example2_WithCallbacks() {
  console.log('\n=== EJEMPLO 2: Motor con Callbacks ===\n');

  let shotsFired = 0;
  let hits = 0;

  const engine = new GameEngine(
    { boardWidth: 10, boardHeight: 10 },
    {
      onTurnChange: (turn) => {
        console.log(`🔄 Turno cambiado a: ${turn === 'PLAYER_TURN' ? 'Jugador' : 'Enemigo'}`);
      },
      onShot: (shot, isPlayerShot) => {
        shotsFired++;
        if (shot.hit) hits++;
        
        const player = isPlayerShot ? 'Jugador' : 'Enemigo';
        const result = shot.hit ? '💥 IMPACTO' : '💦 Agua';
        console.log(`📍 ${player} dispara a (${shot.x}, ${shot.y}): ${result}`);
      },
      onGameOver: (winner) => {
        console.log(`\n🏆 ¡Juego terminado! Ganador: ${winner?.toUpperCase()}`);
        console.log(`📊 Estadísticas:`);
        console.log(`   Total disparos: ${shotsFired}`);
        console.log(`   Total impactos: ${hits}`);
        console.log(`   Precisión: ${((hits / shotsFired) * 100).toFixed(2)}%`);
      },
    }
  );

  // Inicializar juego
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  // Crear IA
  const ai = new AIPlayer(engine);

  // Simular partida completa
  while (!engine.getState().isGameOver) {
    if (engine.isPlayerTurn()) {
      const position = ai.generateRandomShot();
      if (position) {
        const [x, y] = position;
        const result = engine.executeShot(x, y, true);
        if (!result.shipDestroyed) {
          engine.toggleTurn();
        }
      }
    } else {
      const result = ai.executeTurn();
      if (result && !result.shipDestroyed) {
        engine.toggleTurn();
      }
    }
  }

  return engine.getState();
}

// ============================================================================
// EJEMPLO 3: Smart AI vs Random AI
// ============================================================================

export function example3_SmartAIvsRandomAI() {
  console.log('\n=== EJEMPLO 3: Smart AI vs Random AI ===\n');

  const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });

  // Generar barcos
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  // Player usa Smart AI
  const smartAI = new SmartAIPlayer(engine);
  
  // Enemy usa Random AI
  const randomAI = new AIPlayer(engine);

  console.log('Player (Smart AI) vs Enemy (Random AI)\n');

  while (!engine.getState().isGameOver) {
    if (engine.isPlayerTurn()) {
      // Smart AI para el jugador
      const position = smartAI.generateSmartShot();
      if (position) {
        const [x, y] = position;
        const result = engine.executeShot(x, y, true);
        
        // Informar a la IA sobre el resultado
        smartAI.onShotResult(result.hit, position, result.shipDestroyed || false);
        
        if (!result.shipDestroyed) {
          engine.toggleTurn();
        }
      }
    } else {
      // Random AI para el enemigo
      const result = randomAI.executeTurn();
      if (result && !result.shipDestroyed) {
        engine.toggleTurn();
      }
    }
  }

  const state = engine.getState();
  console.log('Resultado:');
  console.log(`Ganador: ${state.winner?.toUpperCase()}`);
  console.log(`Disparos del Smart AI: ${state.playerShots.length}`);
  console.log(`Disparos del Random AI: ${state.enemyShots.length}`);
  console.log(`Impactos del Smart AI: ${state.playerShots.filter(s => s.hit).length}`);
  console.log(`Impactos del Random AI: ${state.enemyShots.filter(s => s.hit).length}`);

  return state;
}

// ============================================================================
// EJEMPLO 4: Simular Múltiples Partidas
// ============================================================================

export function example4_MultipleGames(count: number = 100) {
  console.log(`\n=== EJEMPLO 4: Simulando ${count} Partidas ===\n`);

  const results: { winner: string | null; turns: number }[] = [];
  const config: Partial<GameConfig> = { boardWidth: 10, boardHeight: 10 };

  const startTime = performance.now();

  for (let i = 0; i < count; i++) {
    const engine = new GameEngine(config);
    const playerShips = generateShips(config);
    const enemyShips = generateShips(config);
    engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

    const playerAI = new AIPlayer(engine);
    const enemyAI = new AIPlayer(engine);

    let turns = 0;
    while (!engine.getState().isGameOver && turns < 200) {
      if (engine.isPlayerTurn()) {
        playerAI.executeTurn();
        engine.toggleTurn();
      } else {
        enemyAI.executeTurn();
        engine.toggleTurn();
      }
      turns++;
    }

    const state = engine.getState();
    results.push({
      winner: state.winner,
      turns,
    });
  }

  const duration = performance.now() - startTime;

  // Estadísticas
  const playerWins = results.filter((r) => r.winner === 'player').length;
  const enemyWins = results.filter((r) => r.winner === 'enemy').length;
  const draws = results.filter((r) => r.winner === null).length;
  const avgTurns = results.reduce((sum, r) => sum + r.turns, 0) / count;

  console.log(`✅ ${count} partidas simuladas en ${duration.toFixed(2)}ms`);
  console.log(`   (${(duration / count).toFixed(3)}ms por partida)\n`);
  console.log('Resultados:');
  console.log(`  Victorias del jugador: ${playerWins} (${((playerWins / count) * 100).toFixed(2)}%)`);
  console.log(`  Victorias del enemigo: ${enemyWins} (${((enemyWins / count) * 100).toFixed(2)}%)`);
  console.log(`  Empates: ${draws} (${((draws / count) * 100).toFixed(2)}%)`);
  console.log(`  Promedio de turnos: ${avgTurns.toFixed(2)}`);

  return results;
}

// ============================================================================
// EJEMPLO 5: Inspeccionar Estado del Juego
// ============================================================================

export function example5_InspectGameState() {
  console.log('\n=== EJEMPLO 5: Inspeccionar Estado ===\n');

  const engine = new GameEngine({ boardWidth: 10, boardHeight: 10 });
  
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  // Información inicial
  const dimensions = engine.getBoardDimensions();
  console.log(`Dimensiones del tablero: ${dimensions.width}x${dimensions.height}`);
  console.log(`Turno actual: ${engine.getCurrentTurn()}`);
  console.log(`¿Es turno del jugador?: ${engine.isPlayerTurn()}`);
  console.log(`¿Es turno del enemigo?: ${engine.isEnemyTurn()}\n`);

  // Disparar algunos tiros
  console.log('Ejecutando 5 disparos del jugador...\n');
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    
    if (!engine.isCellShot(x, y, true)) {
      const result = engine.executeShot(x, y, true);
      console.log(`Disparo ${i + 1} a (${x}, ${y}):`);
      console.log(`  Hit: ${result.hit}`);
      console.log(`  Ship ID: ${result.shipId}`);
      console.log(`  Ship destroyed: ${result.shipDestroyed}`);
      console.log(`  Game over: ${result.isGameOver}\n`);
    }
  }

  // Estado actual
  const state = engine.getState();
  console.log('Estado actual del juego:');
  console.log(`  Total de disparos: ${state.shotCount}`);
  console.log(`  Disparos del jugador: ${state.playerShots.length}`);
  console.log(`  Disparos del enemigo: ${state.enemyShots.length}`);
  console.log(`  Impactos del jugador: ${state.playerShots.filter(s => s.hit).length}`);
  console.log(`  Impactos del enemigo: ${state.enemyShots.filter(s => s.hit).length}`);
  console.log(`  ¿Juego terminado?: ${state.isGameOver}`);
  console.log(`  Ganador: ${state.winner || 'N/A'}`);

  // Validación de posiciones
  console.log('\n Validación de posiciones:');
  console.log(`  (5, 5) es válida: ${engine.isValidPosition(5, 5)}`);
  console.log(`  (15, 15) es válida: ${engine.isValidPosition(15, 15)}`);
  console.log(`  (-1, 5) es válida: ${engine.isValidPosition(-1, 5)}`);

  return state;
}

// ============================================================================
// EJEMPLO 6: Replay de Partida (Reproducir disparos guardados)
// ============================================================================

export function example6_ReplayGame() {
  console.log('\n=== EJEMPLO 6: Replay de Partida ===\n');

  // Jugar una partida y guardar los disparos
  const engine1 = new GameEngine({ boardWidth: 10, boardHeight: 10 });
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  engine1.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  const ai = new AIPlayer(engine1);

  console.log('Jugando partida original...\n');
  
  while (!engine1.getState().isGameOver) {
    if (engine1.isPlayerTurn()) {
      ai.executeTurn();
      engine1.toggleTurn();
    } else {
      ai.executeTurn();
      engine1.toggleTurn();
    }
  }

  const originalState = engine1.getState();
  console.log(`Partida terminada. Ganador: ${originalState.winner}`);
  console.log(`Total de disparos: ${originalState.shotCount}\n`);

  // Replay: reproducir los mismos disparos
  console.log('Reproduciendo partida...\n');
  const engine2 = new GameEngine({ boardWidth: 10, boardHeight: 10 });
  engine2.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

  // Reproducir disparos del jugador
  for (const shot of originalState.playerShots) {
    engine2.executeShot(shot.x, shot.y, true);
  }

  // Reproducir disparos del enemigo
  for (const shot of originalState.enemyShots) {
    engine2.executeShot(shot.x, shot.y, false);
  }

  const replayState = engine2.getState();
  
  console.log('Comparación:');
  console.log(`Original  - Ganador: ${originalState.winner}, Disparos: ${originalState.shotCount}`);
  console.log(`Replay    - Ganador: ${replayState.winner}, Disparos: ${replayState.shotCount}`);
  console.log(`¿Estados iguales?: ${originalState.winner === replayState.winner && originalState.shotCount === replayState.shotCount}`);

  return { original: originalState, replay: replayState };
}

// ============================================================================
// FUNCIÓN PARA EJECUTAR TODOS LOS EJEMPLOS
// ============================================================================

export function runAllEngineExamples() {
  console.clear();
  console.log('🎮 EJEMPLOS DEL MOTOR DE JUEGO\n');
  console.log('='.repeat(60));

  example1_BasicGameWithAI();
  example2_WithCallbacks();
  example3_SmartAIvsRandomAI();
  example4_MultipleGames(100);
  example5_InspectGameState();
  example6_ReplayGame();

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Todos los ejemplos completados!\n');
}

// Para usar en la consola:
// import { runAllEngineExamples } from '@/game/engine/examples';
// runAllEngineExamples();
