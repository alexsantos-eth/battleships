# 🎮 Librería del Motor de Juego de Armada

## 📖 Descripción

Esta es una **librería de lógica de juego pura** completamente independiente de cualquier framework o librería de UI. Contiene toda la lógica del juego de batalla naval sin ninguna dependencia de:

- ❌ React / Vue / Angular (frameworks de UI)
- ❌ Zustand / Redux (state management de UI)
- ❌ Three.js (renderizado 3D)
- ❌ Event buses (eventos de cámara)
- ❌ DOM / Browser APIs

> **📦 ¿Quieres mover esta librería a un nuevo proyecto?**  
> Ver: [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) - Guía completa de portabilidad  
> Ver: [standalone.ts](./standalone.ts) - Versión todo-en-uno  
> Ver: [migrate-engine.js](./migrate-engine.js) - Script de migración automática

## ✅ Ventajas

1. **Portabilidad Total**: Usa la misma lógica en cualquier entorno
   - Aplicaciones web (React, Vue, Angular, Svelte)
   - Aplicaciones móviles (React Native, Flutter web)
   - Servidores de juego (Node.js, Deno)
   - Testing headless
   - Herramientas CLI

2. **Separación de Responsabilidades**: Lógica de juego separada de la presentación
   - Más fácil de mantener
   - Más fácil de testear
   - Cambiar UI sin tocar lógica
   - Cambiar lógica sin tocar UI

3. **Testing Simplificado**: Sin mocks de React/Three.js
   - Tests unitarios puros
   - Tests más rápidos
   - Mayor cobertura

4. **Reutilización**: Mismo código para múltiples implementaciones
   - UI web
   - Simulaciones
   - Bots/IA
   - Análisis

## 🏗️ Arquitectura

```
src/game/engine/
├── GameEngine.ts      # Motor principal del juego
├── AIPlayer.ts        # IA del jugador
└── index.ts           # Exportaciones

Uso desde UI:
src/bundle/stores/game/gameStore.ts  # Wrapper de Zustand que usa GameEngine
```

### Flujo de Datos

```
┌─────────────────┐
│  React UI       │
│  (Components)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useGameStore   │  ← Wrapper de Zustand
│   (Zustand)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GameEngine     │  ← Lógica pura
│  (Pure Logic)   │
└─────────────────┘
```

## 🚀 Uso Básico

### 1. Crear una instancia del motor

```typescript
import { GameEngine } from '@/game/engine';

const engine = new GameEngine({
  boardWidth: 10,
  boardHeight: 10,
});
```

### 2. Inicializar una partida

```typescript
import { generateShips } from '@/tools/ship/calculations';

const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });

engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
```

### 3. Ejecutar disparos

```typescript
// Disparo del jugador
const result = engine.executeShot(5, 3, true);

if (result.success) {
  console.log('Hit:', result.hit);
  console.log('Ship destroyed:', result.shipDestroyed);
  console.log('Game over:', result.isGameOver);
  console.log('Winner:', result.winner);
}
```

### 4. Consultar estado

```typescript
const state = engine.getState();
console.log('Current turn:', state.currentTurn);
console.log('Player shots:', state.playerShots.length);
console.log('Enemy shots:', state.enemyShots.length);
console.log('Is game over:', state.isGameOver);
```

## 📚 API Completa

### GameEngine

#### Constructor

```typescript
constructor(config?: Partial<GameConfig>, callbacks?: GameEngineCallbacks)
```

**Parámetros:**
- `config`: Configuración opcional del juego
  - `boardWidth`: Ancho del tablero (default: 10)
  - `boardHeight`: Alto del tablero (default: 10)
- `callbacks`: Callbacks opcionales para observar cambios
  - `onStateChange`: Se llama cuando cambia el estado
  - `onTurnChange`: Se llama cuando cambia el turno
  - `onShot`: Se llama cuando se ejecuta un disparo
  - `onGameOver`: Se llama cuando termina el juego

**Ejemplo:**
```typescript
const engine = new GameEngine(
  { boardWidth: 12, boardHeight: 12 },
  {
    onStateChange: (state) => {
      console.log('State changed:', state);
    },
    onTurnChange: (turn) => {
      console.log('Turn changed:', turn);
    },
    onShot: (shot, isPlayerShot) => {
      console.log('Shot executed:', shot, isPlayerShot ? 'Player' : 'Enemy');
    },
    onGameOver: (winner) => {
      console.log('Game over! Winner:', winner);
    },
  }
);
```

#### Métodos Principales

##### `initializeGame(playerShips, enemyShips, initialTurn)`
Inicializa una nueva partida.

```typescript
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
```

##### `resetGame()`
Reinicia el juego.

```typescript
engine.resetGame();
```

##### `executeShot(x, y, isPlayerShot): ShotResult`
Ejecuta un disparo y retorna el resultado.

```typescript
const result = engine.executeShot(5, 3, true);
// result: { success, hit, shipId, shipDestroyed, isGameOver, winner }
```

##### `checkShot(x, y, isPlayerShot): { hit, shipId }`
Verifica si un disparo impactaría (sin ejecutarlo).

```typescript
const check = engine.checkShot(5, 3, true);
// check: { hit: true, shipId: 2 }
```

##### `isCellShot(x, y, isPlayerShot): boolean`
Verifica si ya se disparó en una celda.

```typescript
if (!engine.isCellShot(5, 3, true)) {
  engine.executeShot(5, 3, true);
}
```

##### `isShipDestroyed(shipId, isPlayerShot): boolean`
Verifica si un barco está completamente destruido.

```typescript
if (engine.isShipDestroyed(0, true)) {
  console.log('Enemy ship 0 is destroyed!');
}
```

#### Métodos de Turnos

```typescript
engine.getCurrentTurn()      // Retorna: 'PLAYER_TURN' | 'ENEMY_TURN'
engine.isPlayerTurn()        // Retorna: boolean
engine.isEnemyTurn()         // Retorna: boolean
engine.setPlayerTurn()       // Establece turno del jugador
engine.setEnemyTurn()        // Establece turno del enemigo
engine.toggleTurn()          // Alterna el turno
```

#### Métodos de Estado

```typescript
engine.getState()                    // Retorna estado completo
engine.getPlayerShips()              // Retorna barcos del jugador
engine.getEnemyShips()               // Retorna barcos del enemigo
engine.getPlayerShots()              // Retorna disparos del jugador
engine.getEnemyShots()               // Retorna disparos del enemigo
engine.getShotCount()                // Retorna total de disparos
engine.getWinner()                   // Retorna ganador (si terminó)
engine.getBoardDimensions()          // Retorna { width, height }
engine.isValidPosition(x, y)        // Verifica si posición es válida
```

#### Métodos de Configuración

```typescript
engine.setBoardDimensions(12, 12)    // Cambia dimensiones del tablero
engine.setPlayerShips(ships)         // Establece barcos del jugador
engine.setEnemyShips(ships)          // Establece barcos del enemigo
engine.setPlayerShots(shots)         // Establece disparos del jugador
engine.setEnemyShots(shots)          // Establece disparos del enemigo
```

### AIPlayer

#### Constructor

```typescript
constructor(engine: GameEngine)
```

**Ejemplo:**
```typescript
import { GameEngine, AIPlayer } from '@/game/engine';

const engine = new GameEngine();
const ai = new AIPlayer(engine);
```

#### Métodos

##### `generateRandomShot(): [number, number] | null`
Genera un disparo aleatorio en una celda no disparada.

```typescript
const position = ai.generateRandomShot();
if (position) {
  const [x, y] = position;
  engine.executeShot(x, y, false);
}
```

##### `executeTurn(): TurnResult | null`
Ejecuta un turno completo de la IA.

```typescript
const result = ai.executeTurn();
if (result) {
  console.log('AI shot at:', result.position);
  console.log('Hit:', result.hit);
  console.log('Ship destroyed:', result.shipDestroyed);
}
```

##### `hasAvailablePositions(): boolean`
Verifica si quedan posiciones disponibles.

```typescript
if (ai.hasAvailablePositions()) {
  ai.executeTurn();
}
```

### SmartAIPlayer

IA avanzada con estrategia inteligente (dispara alrededor de impactos).

```typescript
import { GameEngine, SmartAIPlayer } from '@/game/engine';

const engine = new GameEngine();
const smartAI = new SmartAIPlayer(engine);

// Genera disparo inteligente
const position = smartAI.generateSmartShot();

// Callback después de cada disparo para actualizar estrategia
smartAI.onShotResult(hit, position, shipDestroyed);
```

## 💡 Ejemplos de Uso

### Ejemplo 1: Juego Simple

```typescript
import { GameEngine, AIPlayer } from '@/game/engine';
import { generateShips } from '@/tools/ship/calculations';

// Crear motor
const engine = new GameEngine();

// Generar barcos
const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });

// Inicializar
engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');

// Crear IA
const ai = new AIPlayer(engine);

// Loop de juego
while (!engine.getState().isGameOver) {
  if (engine.isPlayerTurn()) {
    // Turno del jugador (disparo aleatorio para demo)
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    
    if (!engine.isCellShot(x, y, true)) {
      engine.executeShot(x, y, true);
      engine.toggleTurn();
    }
  } else {
    // Turno de la IA
    ai.executeTurn();
    engine.toggleTurn();
  }
}

console.log('Game Over! Winner:', engine.getWinner());
```

### Ejemplo 2: Con React (usando gameStore)

```typescript
import { useGameStore } from '@/bundle/stores/game/gameStore';

function GameComponent() {
  const { 
    isPlayerTurn, 
    playerShots, 
    enemyShots, 
    executeShot,
    winner,
    isGameOver 
  } = useGameStore();

  // El gameStore usa GameEngine internamente
  // Toda la lógica está en el engine, el store solo sincroniza el estado

  return (
    <div>
      <p>Turn: {isPlayerTurn ? 'Player' : 'Enemy'}</p>
      <p>Player shots: {playerShots.length}</p>
      <p>Enemy shots: {enemyShots.length}</p>
      {isGameOver && <p>Winner: {winner}</p>}
    </div>
  );
}
```

### Ejemplo 3: Servidor de Juego (Node.js)

```typescript
import { GameEngine } from '@/game/engine';
import { generateShips } from '@/tools/ship/calculations';

// Crear instancia del motor para cada partida
const gamesMap = new Map<string, GameEngine>();

function createGame(gameId: string) {
  const engine = new GameEngine();
  const playerShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  const enemyShips = generateShips({ boardWidth: 10, boardHeight: 10 });
  
  engine.initializeGame(playerShips, enemyShips, 'PLAYER_TURN');
  gamesMap.set(gameId, engine);
  
  return engine.getState();
}

function executePlayerShot(gameId: string, x: number, y: number) {
  const engine = gamesMap.get(gameId);
  if (!engine) throw new Error('Game not found');
  
  const result = engine.executeShot(x, y, true);
  return {
    result,
    state: engine.getState(),
  };
}
```

### Ejemplo 4: Testing

```typescript
import { describe, it, expect } from '@jest/globals';
import { GameEngine } from '@/game/engine';

describe('GameEngine', () => {
  it('should execute a shot correctly', () => {
    const engine = new GameEngine();
    const ships = [{ coords: [0, 0], variant: 'small', orientation: 'horizontal' }];
    
    engine.initializeGame(ships, ships, 'PLAYER_TURN');
    
    const result = engine.executeShot(0, 0, true);
    
    expect(result.success).toBe(true);
    expect(result.hit).toBe(true);
    expect(result.shipId).toBe(0);
  });

  it('should detect game over', () => {
    const engine = new GameEngine();
    const ships = [{ coords: [0, 0], variant: 'small', orientation: 'horizontal' }];
    
    engine.initializeGame(ships, ships, 'PLAYER_TURN');
    
    // Hundir todos los barcos
    engine.executeShot(0, 0, true);
    engine.executeShot(1, 0, true);
    
    const state = engine.getState();
    expect(state.isGameOver).toBe(true);
    expect(state.winner).toBe('player');
  });
});
```

## 🔄 Migración desde gameStore

El `gameStore` antiguo ahora usa `GameEngine` internamente. Todos los hooks y componentes existentes funcionan sin cambios, pero ahora la lógica está en el engine.

**Antes:**
```typescript
// lógica directamente en el store
const gameStore = create((set, get) => ({
  executeShot: (x, y) => {
    // lógica aquí...
  }
}));
```

**Ahora:**
```typescript
// lógica en el engine
const engine = new GameEngine();

const gameStore = create((set, get) => ({
  _engine: engine,
  executeShot: (x, y) => {
    get()._engine.executeShot(x, y, true);
  }
}));
```

## 🎯 Casos de Uso

### 1. **Aplicación Web (Ya implementado)**
- `gameStore` usa `GameEngine`
- Todos los hooks y componentes funcionan igual
- Separación clara entre lógica y UI

### 2. **Simulaciones Masivas**
```typescript
import { GameEngine } from '@/game/engine';

for (let i = 0; i < 10000; i++) {
  const engine = new GameEngine();
  // ... simular partida
}
```

### 3. **Servidor Multijugador**
```typescript
// Cada sala usa su propia instancia del engine
const gamesMap = new Map<string, GameEngine>();
```

### 4. **Bots/IA Entrenamiento**
```typescript
import { GameEngine, AIPlayer } from '@/game/engine';

// Entrenar IA jugando millones de partidas
function trainAI(generations: number) {
  for (let i = 0; i < generations; i++) {
    const engine = new GameEngine();
    const ai = new AIPlayer(engine);
    // ... jugar y evaluar
  }
}
```

### 5. **Herramientas de Análisis**
```typescript
// Analizar patrones de juego
function analyzeGamePatterns() {
  const engine = new GameEngine();
  // ... replicar partidas históricas
  // ... analizar estrategias
}
```

## 📊 Comparación

### Antes (Todo en gameStore)
- ❌ Lógica acoplada a Zustand
- ❌ Difícil de testear
- ❌ Imposible usar sin React
- ❌ Duplicación de código para simulador

### Ahora (GameEngine + gameStore)
- ✅ Lógica pura e independiente
- ✅ Fácil de testear
- ✅ Funciona en cualquier entorno
- ✅ Código compartido para todo

## 🚧 Roadmap

### Implementado ✅
- [x] GameEngine con toda la lógica del juego
- [x] AIPlayer básico
- [x] SmartAIPlayer con estrategia
- [x] Integración con gameStore
- [x] Callbacks para observar cambios
- [x] Documentación completa

### Por Implementar 🔄
- [ ] Más estrategias de IA
- [ ] Sistema de replay (grabar y reproducir partidas)
- [ ] Validaciones más estrictas
- [ ] Sistema de reglas configurable
- [ ] Soporte para variantes del juego
- [ ] Serialización/deserialización de estado
- [ ] Sistema de eventos más robusto

## 📝 Notas

- El engine es **inmutable hacia afuera** (retorna copias del estado)
- El engine es **síncrono** (sin delays, timeouts o animaciones)
- Los callbacks son **opcionales** (para conectar con UI)
- El engine **no depende** de ninguna librería externa excepto tipos

## 🤝 Contribuir

Para agregar funcionalidad al engine:

1. **Solo lógica pura** (sin React, sin Three.js)
2. **Sin side effects** (sin console.log, sin fetch, sin localStorage)
3. **Testeable** (escribir tests unitarios)
4. **Documentado** (actualizar este README)

## 📄 Licencia

Parte del proyecto Armada.io
