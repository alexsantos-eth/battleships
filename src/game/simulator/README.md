# 🎮 Simulador de Batallas de Armada

El simulador de batallas permite ejecutar partidas completas de Armada **sin actualizar la UI**, ideal para:

- ✅ Testing automatizado
- 📊 Generación de estadísticas
- 🤖 Entrenamiento de IA
- ⚖️ Análisis de balance del juego
- 🔬 Investigación de estrategias

## 🚀 Instalación y Uso

### Importar el simulador

```typescript
import { 
  simulateSingleGame, 
  simulateMultipleGames,
  BattleSimulator 
} from '@/game/simulator';
```

## 📖 Ejemplos de Uso

### 1. Simular una partida simple

```typescript
import { simulateSingleGame } from '@/game/simulator';

const result = simulateSingleGame();

console.log(`Ganador: ${result.winner}`);
console.log(`Total de turnos: ${result.totalTurns}`);
console.log(`Disparos del jugador: ${result.playerShots}`);
console.log(`Impactos del jugador: ${result.playerHits}`);
```

### 2. Simular con configuración personalizada

```typescript
const result = simulateSingleGame({
  boardWidth: 12,
  boardHeight: 12,
  shipCounts: {
    small: 2,
    medium: 3,
    large: 2,
    xlarge: 1,
  },
  initialTurn: 'player', // 'player', 'enemy', o 'random'
});
```

### 3. Simular múltiples partidas

```typescript
import { simulateMultipleGames } from '@/game/simulator';

const { results, stats } = simulateMultipleGames(1000, {
  boardWidth: 10,
  boardHeight: 10,
});

console.log('Victorias del jugador:', stats.playerWins);
console.log('Victorias del enemigo:', stats.enemyWins);
console.log('Promedio de turnos:', stats.avgTurns);
console.log('Precisión promedio del jugador:', stats.avgPlayerAccuracy + '%');
```

### 4. Usar la clase BattleSimulator directamente

Para control avanzado y reutilización de configuraciones:

```typescript
import { BattleSimulator } from '@/game/simulator';

const simulator = new BattleSimulator({
  boardWidth: 10,
  boardHeight: 10,
  shipCounts: {
    small: 1,
    medium: 2,
    large: 1,
    xlarge: 1,
  },
});

// Simular primera partida
const result1 = simulator.simulate();

// Simular otra partida (se generan nuevos barcos)
const result2 = simulator.simulate();

// Simular con barcos específicos
const state = simulator.getState();
const result3 = simulator.simulate({
  playerShips: state.playerShips,
  enemyShips: state.enemyShips,
});
```

## 📊 Estructura del Resultado

### BattleResult

```typescript
interface BattleResult {
  winner: 'player' | 'enemy' | null;      // Ganador de la partida
  totalTurns: number;                     // Total de turnos jugados
  playerShots: number;                    // Total de disparos del jugador
  enemyShots: number;                     // Total de disparos del enemigo
  playerHits: number;                     // Impactos del jugador
  enemyHits: number;                      // Impactos del enemigo
  shipPlacements: {                       // Posiciones de los barcos
    player: ShipPlacement[];
    enemy: ShipPlacement[];
  };
  shotHistory: ShotRecord[];              // Historial completo de disparos
}
```

### Estadísticas de Múltiples Partidas

```typescript
interface MultiGameStats {
  playerWins: number;                     // Total de victorias del jugador
  enemyWins: number;                      // Total de victorias del enemigo
  draws: number;                          // Total de empates
  avgTurns: number;                       // Promedio de turnos por partida
  avgPlayerHits: number;                  // Promedio de impactos del jugador
  avgEnemyHits: number;                   // Promedio de impactos del enemigo
  avgPlayerAccuracy: number;              // Precisión promedio del jugador (%)
  avgEnemyAccuracy: number;               // Precisión promedio del enemigo (%)
}
```

## 🎯 Casos de Uso

### Testing Automatizado

```typescript
import { simulateSingleGame } from '@/game/simulator';

describe('BattleSimulator', () => {
  it('should complete a game within max turns', () => {
    const result = simulateSingleGame();
    expect(result.totalTurns).toBeLessThan(200);
    expect(result.winner).not.toBeNull();
  });

  it('should have valid hit counts', () => {
    const result = simulateSingleGame();
    expect(result.playerHits).toBeLessThanOrEqual(result.playerShots);
    expect(result.enemyHits).toBeLessThanOrEqual(result.enemyShots);
  });
});
```

### Análisis de Balance

```typescript
import { simulateMultipleGames } from '@/game/simulator';

// Comparar diferentes configuraciones
const configs = [
  { name: '10x10', config: { boardWidth: 10, boardHeight: 10 } },
  { name: '12x12', config: { boardWidth: 12, boardHeight: 12 } },
  { name: '15x15', config: { boardWidth: 15, boardHeight: 15 } },
];

configs.forEach(({ name, config }) => {
  const { stats } = simulateMultipleGames(1000, config);
  
  console.log(`\n${name}:`);
  console.log(`  Balance: ${stats.playerWins}/${stats.enemyWins}`);
  console.log(`  Turnos promedio: ${stats.avgTurns.toFixed(2)}`);
  console.log(`  Precisión promedio: ${stats.avgPlayerAccuracy.toFixed(2)}%`);
});
```

### Generación de Estadísticas

```typescript
import { simulateMultipleGames } from '@/game/simulator';

// Simular 10,000 partidas para estadísticas confiables
const { results, stats } = simulateMultipleGames(10000);

// Analizar distribución de turnos
const turnDistribution = results.reduce((acc, result) => {
  const bucket = Math.floor(result.totalTurns / 10) * 10;
  acc[bucket] = (acc[bucket] || 0) + 1;
  return acc;
}, {} as Record<number, number>);

console.log('Distribución de turnos:', turnDistribution);

// Encontrar la partida más corta y más larga
const shortestGame = results.reduce((min, r) => 
  r.totalTurns < min.totalTurns ? r : min
);
const longestGame = results.reduce((max, r) => 
  r.totalTurns > max.totalTurns ? r : max
);

console.log('Partida más corta:', shortestGame.totalTurns, 'turnos');
console.log('Partida más larga:', longestGame.totalTurns, 'turnos');
```

### Análisis del Historial de Disparos

```typescript
import { simulateSingleGame } from '@/game/simulator';

const result = simulateSingleGame();

// Analizar patrones de disparo
const playerShots = result.shotHistory.filter(s => s.turn === 'PLAYER_TURN');
const enemyShots = result.shotHistory.filter(s => s.turn === 'ENEMY_TURN');

console.log('Primer disparo del jugador:', playerShots[0]);
console.log('Primer impacto del jugador:', playerShots.find(s => s.hit));

// Calcular tiempo hasta primer impacto
const firstHit = result.shotHistory.findIndex(s => s.hit);
console.log('Turnos hasta primer impacto:', firstHit + 1);
```

## 🧪 Página de Prueba

Se incluye una página de prueba interactiva en `/pages/SimulatorTest/index.tsx` que permite:

- Simular partidas individuales con visualización detallada
- Simular 100, 1,000 o 10,000 partidas con estadísticas
- Ver historial de disparos
- Comparar configuraciones

Para usarla, agrega la ruta en tu router:

```typescript
import SimulatorTestPage from '@/pages/SimulatorTest';

// En tu router
<Route path="/simulator-test" element={<SimulatorTestPage />} />
```

## 🎓 Ejemplos Incluidos

En `/game/simulator/examples.ts` se incluyen 6 ejemplos completos:

1. **example1_SingleGame** - Simular una partida simple
2. **example2_CustomConfig** - Configuración personalizada
3. **example3_MultipleGames** - Múltiples partidas con estadísticas
4. **example4_AdvancedControl** - Uso avanzado de la clase
5. **example5_ShotHistory** - Análisis del historial
6. **example6_CompareConfigs** - Comparación de configuraciones

Para ejecutar todos los ejemplos:

```typescript
import { runAllExamples } from '@/game/simulator';

runAllExamples();
```

## ⚡ Rendimiento

El simulador es extremadamente rápido ya que:

- No actualiza ningún estado de React/Zustand
- No dispara eventos de cámara
- No tiene delays entre turnos
- No renderiza componentes

**Benchmarks aproximados:**
- 1 partida: < 1ms
- 100 partidas: ~50-100ms
- 1,000 partidas: ~500ms - 1s
- 10,000 partidas: ~5-10s

## 🔧 Arquitectura Técnica

### Separación de Lógica

El simulador es **completamente independiente** de:
- ❌ Zustand Store
- ❌ React Hooks
- ❌ Eventos de cámara
- ❌ Sistema de UI
- ❌ Sistema de animaciones

Solo usa:
- ✅ Lógica pura de juego
- ✅ Funciones de utilidad
- ✅ Generación de barcos
- ✅ Tipos compartidos

### Flujo de Ejecución

```
1. Inicializar simulador con config
2. Generar barcos para ambos jugadores
3. Determinar turno inicial
4. Loop principal:
   a. Generar disparo aleatorio
   b. Verificar impacto
   c. Registrar en historial
   d. Verificar fin de juego
   e. Alternar turno
5. Calcular estadísticas
6. Retornar resultado
```

## 📝 Notas

- El simulador usa IA completamente aleatoria para ambos jugadores
- No hay estrategia avanzada, solo disparos a celdas no disparadas
- Las estadísticas deberían mostrar ~50% de victorias para cada lado
- El límite máximo de turnos es 200 para evitar loops infinitos
- Todos los disparos se ejecutan instantáneamente sin delays

## 🤝 Contribuir

Para extender el simulador:

1. **Agregar estrategias de IA**: Modificar `generateRandomShot()` con lógica inteligente
2. **Agregar métricas**: Extender `BattleResult` con nuevas estadísticas
3. **Optimizar rendimiento**: Usar Web Workers para simulaciones masivas
4. **Agregar visualización**: Crear gráficos de estadísticas

## 📄 Licencia

Parte del proyecto Armada.io
