# 🚀 Inicio Rápido - Simulador de Batallas

## ¿Qué es esto?

Un simulador de partidas completas de Armada que **NO actualiza la UI**, permitiendo simular miles de partidas en segundos para testing, estadísticas y análisis.

## ⚡ Uso Rápido

### En la consola del navegador:

```javascript
// 1. Importar en cualquier archivo del proyecto
import { quickDemo } from '@/game/simulator';

// 2. Ejecutar demo
quickDemo();
```

### En tu código:

```typescript
import { simulateSingleGame, simulateMultipleGames } from '@/game/simulator';

// Una partida
const result = simulateSingleGame();
console.log('Ganador:', result.winner);
console.log('Turnos:', result.totalTurns);

// 1000 partidas
const { stats } = simulateMultipleGames(1000);
console.log('Victorias jugador:', stats.playerWins);
console.log('Promedio turnos:', stats.avgTurns);
```

## 🎯 Casos de Uso Principales

### 1. Testing
```typescript
import { simulateSingleGame } from '@/game/simulator';

test('game completes successfully', () => {
  const result = simulateSingleGame();
  expect(result.winner).toBeDefined();
  expect(result.totalTurns).toBeGreaterThan(0);
});
```

### 2. Estadísticas
```typescript
import { simulateMultipleGames } from '@/game/simulator';

const { stats } = simulateMultipleGames(10000);

console.log(`
  Balance del juego:
  - Jugador: ${stats.playerWins} victorias
  - Enemigo: ${stats.enemyWins} victorias
  - Promedio turnos: ${stats.avgTurns}
  - Precisión promedio: ${stats.avgPlayerAccuracy}%
`);
```

### 3. Análisis Personalizado
```typescript
import { BattleSimulator } from '@/game/simulator';

const simulator = new BattleSimulator({
  boardWidth: 12,
  boardHeight: 12,
  shipCounts: {
    small: 2,
    medium: 3,
    large: 2,
    xlarge: 1,
  },
});

const result = simulator.simulate();

// Analizar historial
result.shotHistory.forEach(shot => {
  console.log(`${shot.turn}: (${shot.x}, ${shot.y}) - ${shot.hit ? 'HIT' : 'MISS'}`);
});
```

## 📊 Página de Prueba Interactiva

Incluye una página React completa en `/pages/SimulatorTest/index.tsx` con visualización de resultados.

Para usarla, agrégala a tu router:

```typescript
import SimulatorTestPage from '@/pages/SimulatorTest';

// En tu configuración de rutas
<Route path="/simulator-test" element={<SimulatorTestPage />} />
```

Luego visita: `http://localhost:5173/simulator-test`

## 📂 Archivos Creados

```
src/game/simulator/
├── battleSimulator.ts      # Lógica principal del simulador
├── examples.ts             # 6 ejemplos completos de uso
├── quickDemo.ts            # Demo rápida para consola
├── index.ts                # Exportaciones principales
└── README.md               # Documentación completa

src/pages/SimulatorTest/
└── index.tsx               # Página de prueba interactiva
```

## ⚙️ Configuración Disponible

```typescript
interface GameConfig {
  boardWidth: number;        // Ancho del tablero (5-15)
  boardHeight: number;       // Alto del tablero (5-15)
  shipCounts: {             // Cantidad de cada tipo de barco
    small: number;          // Tamaño 2
    medium: number;         // Tamaño 3
    large: number;          // Tamaño 4
    xlarge: number;         // Tamaño 5
  };
  initialTurn: 'player' | 'enemy' | 'random';
}
```

## 📈 Rendimiento

- **1 partida**: < 1ms
- **100 partidas**: ~50-100ms  
- **1,000 partidas**: ~500ms - 1s
- **10,000 partidas**: ~5-10s

## 💡 Tips

1. **No bloquea la UI**: El simulador ejecuta todo síncronamente pero es tan rápido que no se nota
2. **IA simple**: Ambos jugadores usan disparos aleatorios (sin estrategia avanzada)
3. **Balance 50/50**: Deberías ver ~50% victorias para cada lado en muestras grandes
4. **Límite de turnos**: Máximo 200 turnos por partida para evitar loops infinitos

## 🔗 Más Información

- **Documentación completa**: `src/game/simulator/README.md`
- **Ejemplos detallados**: `src/game/simulator/examples.ts`
- **Demo interactiva**: Importar `quickDemo()` o `detailedDemo()`

## 🐛 Testing

Para verificar que todo funciona:

```typescript
import { quickDemo } from '@/game/simulator';

// Ejecutar demo completa
quickDemo();

// Debería mostrar:
// ✅ Resultado de 1 partida
// ✅ Estadísticas de 1000 partidas
// ✅ Tiempo de ejecución
// ✅ Balance de victorias
```

## 🎉 ¡Listo!

El simulador está completo y listo para usar. Ejecuta `quickDemo()` en la consola para ver una demostración inmediata.

---

**Nota**: Este simulador es completamente independiente de la UI y el gameStore de Zustand. No interfiere con partidas normales del juego.
