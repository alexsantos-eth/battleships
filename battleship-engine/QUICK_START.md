# 🚀 Inicio Rápido - Librería del Motor de Juego

## ¿Qué es esto?

Una **librería de lógica de juego pura** completamente independiente de React, Three.js y cualquier framework de UI. Todo el código del juego está ahora abstraído y puede usarse en cualquier contexto.

## ⚡ Uso Inmediato

### 1. Importar el motor

```typescript
import { GameEngine, AIPlayer } from "./index";
```

### 2. Crear y jugar

```typescript
// Crear motor
const engine = new GameEngine();

// Generar barcos
import { generateShips } from "../../tools/ship/calculations";
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });

// Inicializar
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

// Disparar
const result = engine.executeShot(5, 3, true);
console.log('Hit:', result.hit);
```

### 3. Con IA

```typescript
const ai = new AIPlayer(engine);
const result = ai.executeTurn();
console.log('AI shot at:', result?.position);
```

## 🎯 En React (UI existente)

```typescript
import { useGameStore } from '@/bundle/stores/game/gameStore';

function MyComponent() {
  const { isPlayerTurn, playerShots, enemyShots } = useGameStore();
  
  // Todo funciona igual, pero ahora usa GameEngine internamente
  return <div>Turn: {isPlayerTurn ? 'Player' : 'Enemy'}</div>;
}
```

**No necesitas cambiar tu código de UI existente** - el `gameStore` ahora usa `GameEngine` por debajo automáticamente.

## 📦 Estructura Creada

```
src/game/
├── engine/
│   ├── GameEngine.ts         # Motor principal (lógica pura)
│   ├── AIPlayer.ts            # IA del jugador
│   ├── examples.ts            # 6 ejemplos de uso
│   ├── index.ts               # Exportaciones
│   └── README.md              # Documentación completa
│
├── simulator/                 # Simulador headless (ya existía)
│   ├── battleSimulator.ts
│   └── ...
│
└── manager/                   # Inicializador (ya existía)
    └── initializer.ts

src/bundle/stores/game/
└── gameStore.ts               # ✨ REFACTORIZADO: ahora usa GameEngine
```

## ✨ Lo que Cambió

### Antes:
```typescript
// Lógica mezclada con Zustand
const gameStore = create((set, get) => ({
  executeShot: (x, y) => {
    // lógica directamente aquí...
    const ships = get().enemyShips;
    // más lógica...
  }
}));
```

### Ahora:
```typescript
// Lógica en el engine, store solo sincroniza
const engine = new GameEngine();

const gameStore = create((set, get) => ({
  _engine: engine,
  executeShot: (x, y) => {
    get()._engine.executeShot(x, y, true);
  }
}));
```

## 🎮 Ejemplos Rápidos

### Ejecutar demo en consola

```typescript
import { runAllEngineExamples } from "./index";
runAllEngineExamples();
```

### Simular una partida

```typescript
import { GameEngine, AIPlayer } from "./index";
import { generateShips } from "../../tools/ship/calculations";

const engine = new GameEngine();
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });

engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

const ai = new AIPlayer(engine);

while (!engine.getState().isGameOver) {
  if (engine.isPlayerTurn()) {
    ai.executeTurn();
    engine.toggleTurn();
  } else {
    ai.executeTurn();
    engine.toggleTurn();
  }
}

console.log('Winner:', engine.getWinner());
```

### Con Callbacks (para UI)

```typescript
const engine = new GameEngine(
  { boardWidth: 10, boardHeight: 10 },
  {
    onTurnChange: (turn) => {
      console.log('Turn changed:', turn);
    },
    onShot: (shot, isPlayerShot) => {
      console.log('Shot:', shot, isPlayerShot ? 'Player' : 'Enemy');
    },
    onGameOver: (winner) => {
      console.log('Game over! Winner:', winner);
    },
  }
);
```

## 📚 Documentación Completa

Consulta [README.md](./README.md) para:
- API completa
- Todos los métodos disponibles
- Ejemplos avanzados
- Casos de uso
- Guías de migración

## 🧪 Probar los Ejemplos

```typescript
// Ejemplo 1: Juego básico
import { example1_BasicGameWithAI } from "./index";
example1_BasicGameWithAI();

// Ejemplo 2: Con callbacks
import { example2_WithCallbacks } from "./index";
example2_WithCallbacks();

// Ejemplo 3: Smart AI vs Random AI
import { example3_SmartAIvsRandomAI } from "./index";
example3_SmartAIvsRandomAI();

// Ejemplo 4: Simular 100 partidas
import { example4_MultipleGames } from "./index";
example4_MultipleGames(100);

// Ejemplo 5: Inspeccionar estado
import { example5_InspectGameState } from "./index";
example5_InspectGameState();

// Ejemplo 6: Replay de partida
import { example6_ReplayGame } from "./index";
example6_ReplayGame();
```

## 🎯 Ventajas de la Nueva Arquitectura

| Antes | Ahora |
|-------|-------|
| ❌ Lógica acoplada a Zustand | ✅ Lógica pura e independiente |
| ❌ Difícil de testear | ✅ Fácil de testear (sin mocks) |
| ❌ Solo funciona con React | ✅ Funciona en cualquier entorno |
| ❌ Código duplicado (simulador) | ✅ Código compartido |
| ❌ No portable | ✅ Totalmente portable |

## ⚙️ API Esencial

### GameEngine

```typescript
// Crear
const engine = new GameEngine(config, callbacks);

// Inicializar
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

// Disparar
engine.executeShot(x, y, isPlayerShot);

// Consultar
engine.getState();
engine.getCurrentTurn();
engine.isPlayerTurn();
engine.getPlayerShips();
engine.getPlayerShots();
engine.getBoardDimensions();

// Controlar
engine.toggleTurn();
engine.resetGame();
```

### AIPlayer

```typescript
// Crear
const ai = new AIPlayer(engine);

// Usar
const position = ai.generateRandomShot();
const result = ai.executeTurn();
const hasPositions = ai.hasAvailablePositions();
```

## 🔧 Integración con Código Existente

**Todos los hooks y componentes existentes siguen funcionando sin cambios.**

```typescript
// Esto sigue funcionando igual
import { useGameStore } from '@/bundle/stores/game/gameStore';

const MyComponent = () => {
  const { isPlayerTurn, playerShots } = useGameStore();
  // ... tu código existente
};
```

La única diferencia: ahora `gameStore` usa `GameEngine` internamente, pero la interfaz es la misma.

## 🚧 Compatibilidad

- ✅ **100% compatible** con código UI existente
- ✅ **Sin breaking changes** en hooks
- ✅ **Sin breaking changes** en componentes
- ✅ **Todos los tests existentes pasan**

## 🎉 ¡Listo para Usar!

La librería está lista y completamente funcional. Puedes:

1. **Usar en UI** → El gameStore ya lo usa automáticamente
2. **Crear simulaciones** → Importa `GameEngine` directamente
3. **Testing** → Testea lógica pura sin mocks
4. **Servidor** → Usa el mismo código en Node.js

## 📞 Soporte

- Documentación completa: [README.md](./README.md)
- Ejemplos: [examples.ts](./examples.ts)
- Código: [GameEngine.ts](./GameEngine.ts)

---

**¡La lógica del juego ahora es verdaderamente portable!** 🚀
