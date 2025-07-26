# Sistema Determinista de Batalla Naval

## 🎯 Descripción

Este sistema permite simular batallas de batalla naval de manera completamente determinista. Esto significa que con los mismos parámetros de entrada (semilla, posiciones de barcos, historial de tiros), siempre se obtendrá el mismo resultado.

## 🔧 Componentes Principales

### 1. DeterministicRandom
Generador de números pseudo-aleatorios determinista basado en el algoritmo Linear Congruential Generator (LCG).

```typescript
import { DeterministicRandom } from './deterministicRandom';

const random = new DeterministicRandom(12345);
const value = random.next(); // Número entre 0 y 1
const int = random.nextInt(1, 10); // Entero entre 1 y 10
const bool = random.nextBoolean(); // true/false
const choice = random.nextChoice(['a', 'b', 'c']); // Elección de array
```

### 2. BattleSimulator
Simulador de batallas que mantiene todas las decisiones aleatorias pero las hace reproducibles.

```typescript
import { BattleSimulator } from './battleSimulator';

const config = {
  seed: 12345,
  boardWidth: 10,
  boardHeight: 10
};

const simulator = new BattleSimulator(config);
const result = simulator.simulateRandomBattle(100);
```

## 🚀 Casos de Uso

### 1. Simulación de Batalla Aleatoria
```typescript
const result = simulator.simulateRandomBattle(200);
console.log(`Ganador: ${result.winner}`);
console.log(`Total turnos: ${result.totalTurns}`);
```

### 2. Ejecución de Instrucciones Específicas
```typescript
const instructions = [
  {
    type: 'place_ship',
    data: {
      player: 'player',
      position: { x: 0, y: 0 },
      variant: 'small',
      orientation: 'horizontal'
    }
  },
  {
    type: 'fire_shot',
    data: { position: { x: 0, y: 0 } }
  }
];

const result = simulator.executeInstructions(instructions);
```

### 3. Comparación de Estrategias
```typescript
// Estrategia diagonal
const diagonalResult = simulator.executeInstructions(diagonalInstructions);

// Estrategia por filas
const rowResult = simulator.executeInstructions(rowInstructions);

console.log(`Diagonal: ${diagonalResult.playerHits} hits`);
console.log(`Filas: ${rowResult.playerHits} hits`);
```

## 📊 Resultados

El sistema proporciona información detallada sobre cada batalla:

- **Ganador**: 'player' | 'enemy' | null
- **Estadísticas**: Total de turnos, disparos, aciertos
- **Historial**: Secuencia completa de disparos con resultados
- **Posiciones de barcos**: Ubicación exacta de cada barco

## 🔬 Determinismo

### Verificación
```typescript
// Misma semilla = mismos resultados
const result1 = simulator1.simulateRandomBattle(100);
const result2 = simulator2.simulateRandomBattle(100);
expect(result1.winner).toBe(result2.winner);
expect(result1.totalTurns).toBe(result2.totalTurns);
```

### Reproducibilidad
- **Semilla**: Controla toda la aleatoriedad
- **Posiciones de barcos**: Pueden ser predefinidas o aleatorias
- **Historial de tiros**: Secuencia exacta de disparos
- **Resultados**: Siempre idénticos con los mismos parámetros

## 🎮 Integración con el Juego

El sistema mantiene compatibilidad con el juego existente:

- **Mismas reglas**: Colocación de barcos, validación de disparos
- **Misma lógica**: Detección de hits, destrucción de barcos
- **Misma interfaz**: APIs compatibles con el sistema actual

## 📈 Beneficios

1. **Testing**: Simulaciones reproducibles para testing
2. **Análisis**: Comparación de estrategias
3. **Debugging**: Identificación de problemas específicos
4. **Investigación**: Análisis de patrones de juego
5. **IA**: Entrenamiento de algoritmos con datos consistentes

## 🛠️ Uso Avanzado

### Configuración Personalizada
```typescript
const config = {
  seed: 12345,
  boardWidth: 10,
  boardHeight: 10,
  playerShips: [
    { position: { x: 0, y: 0 }, variant: 'small', orientation: 'horizontal' }
  ],
  enemyShips: [
    { position: { x: 5, y: 5 }, variant: 'large', orientation: 'vertical' }
  ]
};
```

### Análisis de Rendimiento
```typescript
const results = [];
for (let seed = 0; seed < 1000; seed++) {
  const simulator = new BattleSimulator({ seed, boardWidth: 10, boardHeight: 10 });
  const result = simulator.simulateRandomBattle(200);
  results.push(result);
}

const playerWins = results.filter(r => r.winner === 'player').length;
const avgTurns = results.reduce((sum, r) => sum + r.totalTurns, 0) / results.length;
```

## 🧪 Testing

```bash
# Ejecutar tests del sistema determinista
npm test -- --testPathPatterns="deterministicRandom|battleSimulator"
```

## 📝 Ejemplos

Ver `src/game/logic/examples/deterministicBattleExample.ts` para ejemplos completos de uso.

## 🔮 Futuras Mejoras

1. **Algoritmos de IA**: Integración con algoritmos de búsqueda
2. **Análisis estadístico**: Métricas avanzadas de rendimiento
3. **Visualización**: Gráficos de batallas y estrategias
4. **Optimización**: Algoritmos más eficientes para simulaciones masivas
5. **Networking**: Simulaciones distribuidas en múltiples nodos 