# API Reference - Armada.io

## GameStore (Zustand)

### Estado

```typescript
interface GameState {
  currentTurn: GameTurn;
  isPlayerTurn: boolean;
  isEnemyTurn: boolean;
  playerShips: Ship[];
  enemyShips: Ship[];
  playerShots: Shot[];
  enemyShots: Shot[];
  isGameOver: boolean;
  winner: "player" | "enemy" | null;
}
```

### Métodos

#### Gestión de Turnos

```typescript
setPlayerTurn(): void
```
Establece el turno del jugador y actualiza el estado de la cámara.

```typescript
setEnemyTurn(): void
```
Establece el turno del enemigo y actualiza el estado de la cámara.

```typescript
toggleTurn(): void
```
Alterna entre turnos del jugador y enemigo, emitiendo eventos de cámara correspondientes.

```typescript
initializeRandomTurn(): void
```
Inicializa el juego con un turno aleatorio (jugador o enemigo).

#### Gestión de Barcos

```typescript
setPlayerShips(ships: Ship[]): void
```
Establece los barcos del jugador.

```typescript
setEnemyShips(ships: Ship[]): void
```
Establece los barcos del enemigo.

#### Gestión de Disparos

```typescript
addPlayerShot(shot: Shot): void
```
Añade un disparo del jugador y verifica condiciones de fin de juego.

```typescript
addEnemyShot(shot: Shot): void
```
Añade un disparo del enemigo y verifica condiciones de fin de juego.

#### Lógica del Juego

```typescript
checkShot(x: number, y: number, isPlayerShot: boolean): { hit: boolean; shipId?: number }
```
Verifica si un disparo en las coordenadas especificadas impacta en un barco.

**Parámetros:**
- `x`: Coordenada X de la cuadrícula
- `y`: Coordenada Y de la cuadrícula
- `isPlayerShot`: Indica si es un disparo del jugador

**Retorna:**
- `hit`: Boolean indicando si hubo impacto
- `shipId`: ID del barco impactado (si aplica)

```typescript
isCellShot(x: number, y: number, isPlayerShot: boolean): boolean
```
Verifica si una celda ya ha sido disparada.

```typescript
isShipDestroyed(shipId: number, isPlayerShot: boolean): boolean
```
Verifica si un barco específico está completamente destruido.

#### Gestión del Juego

```typescript
initializeGame(): void
```
Inicializa el juego generando barcos aleatorios si no existen.

```typescript
checkGameOver(): void
```
Verifica si el juego ha terminado y establece el ganador.

```typescript
resetGame(): void
```
Reinicia completamente el estado del juego.

## ArmadaGame Class

### Constructor

```typescript
constructor(boardWidth: number = 10, boardHeight: number = 10)
```

### Métodos de Turno

```typescript
getCurrentTurn(): GameTurn
```
Retorna el turno actual.

```typescript
isPlayerTurn(): boolean
```
Verifica si es el turno del jugador.

```typescript
isEnemyTurn(): boolean
```
Verifica si es el turno del enemigo.

```typescript
toggleTurn(): void
```
Alterna entre turnos.

```typescript
setRandomTurn(): void
```
Establece un turno aleatorio.

### Gestión de Barcos

```typescript
addShip(board: "player" | "enemy", ship: Omit<Ship, "id" | "hits">): boolean
```
Añade un barco al tablero especificado.

**Retorna:** `true` si el barco se añadió exitosamente.

```typescript
getShipSize(variant: ShipVariant): number
```
Retorna el tamaño de un barco según su variante.

### Disparos

```typescript
fireShot(board: "player" | "enemy", position: Position): Shot
```
Realiza un disparo en la posición especificada.

**Lanza:** `Error` si la posición ya fue disparada.

### Verificaciones

```typescript
isShipDestroyed(board: "player" | "enemy", shipId: number): boolean
```
Verifica si un barco está destruido.

```typescript
isGameOver(): boolean
```
Verifica si el juego ha terminado.

```typescript
getWinner(): "player" | "enemy" | null
```
Retorna el ganador del juego.

### Consultas

```typescript
getBoard(board: "player" | "enemy"): GameBoard
```
Retorna una copia del tablero especificado.

```typescript
getShips(board: "player" | "enemy"): Ship[]
```
Retorna una copia de los barcos del tablero especificado.

```typescript
getShots(board: "player" | "enemy"): Shot[]
```
Retorna una copia de los disparos del tablero especificado.

```typescript
isPositionShot(board: "player" | "enemy", position: Position): boolean
```
Verifica si una posición ya fue disparada.

```typescript
getShipAtPosition(board: "player" | "enemy", position: Position): Ship | null
```
Retorna el barco en la posición especificada, o `null` si no hay ninguno.

## ShipGenerator

### Funciones

```typescript
getRandomShips(): Ship[]
```
Genera una configuración aleatoria de barcos estándar.

```typescript
getRandomShipsWithConfig(shipDefinitions: ShipDefinition[]): Ship[]
```
Genera barcos según una configuración personalizada.

```typescript
getFewShips(): Ship[]
```
Genera una configuración mínima de barcos (2 barcos pequeños).

### Tipos

```typescript
interface ShipDefinition {
  variant: "small" | "medium" | "large" | "xlarge";
  size: number;
}
```

## EventBus

### Métodos

```typescript
on(event: string, callback: EventCallback): void
```
Suscribe un callback a un evento.

```typescript
off(event: string, callback: EventCallback): void
```
Desuscribe un callback de un evento.

```typescript
emit(event: string, ...args: unknown[]): void
```
Emite un evento con argumentos opcionales.

```typescript
clear(): void
```
Limpia todos los eventos registrados.

### Eventos Disponibles

```typescript
const EVENTS = {
  CAMERA_SHOOT_START: "camera_shoot_start",
  CAMERA_SHOOT_END: "camera_shoot_end",
  CAMERA_TOGGLE_PLAYER_PERSPECTIVE: "camera_toggle_player_perspective",
} as const;
```

## useCameraEvents Hook

### Parámetros

```typescript
interface UseCameraEventsOptions {
  onShootStart?: (data: CameraEventData) => void;
  onShootEnd?: (data: CameraEventData) => void;
  animationSpeed?: number;
}
```

### Retorna

```typescript
interface UseCameraEventsReturn {
  isShooting: boolean;
  shootData: CameraEventData | null;
  triggerShoot: () => void;
}
```

### Tipos

```typescript
interface CameraEventData {
  newRotation: number;
  targetDistance: number;
}
```

## Componentes React

### GameGrid

```typescript
interface GameGridProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  enablePressGrid?: boolean;
  isPlayerBoard?: boolean;
}
```

### PressGrid

Maneja la interacción de clicks del jugador en el tablero enemigo.

**Eventos:**
- `onClick`: Disparo en celda
- `onExplosion`: Efecto de explosión

### WaterExplosion

```typescript
interface WaterExplosionProps {
  position: [number, number];
  onDone: () => void;
}
```

### Cell

```typescript
interface CellProps {
  position: [number, number, number];
  onClick: (pos: [number, number, number]) => void;
  isShot: boolean;
  isHit: boolean;
}
```

## Utilidades de Coordenadas

### Funciones

```typescript
worldToGridCoordinates(pos: [number, number, number]): [number, number]
```
Convierte coordenadas 3D a coordenadas de cuadrícula.

```typescript
gridToWorldCoordinates(x: number, y: number): [number, number]
```
Convierte coordenadas de cuadrícula a coordenadas 3D.

```typescript
isValidGridPosition(x: number, y: number): boolean
```
Verifica si las coordenadas están dentro del rango válido (0-9).

## Tipos de Datos

### Ship

```typescript
interface Ship {
  coords: [number, number];
  variant: ShipVariant;
  orientation: "horizontal" | "vertical";
}
```

### Shot

```typescript
interface Shot {
  x: number;
  y: number;
  hit: boolean;
  shipId?: number;
}
```

### GameTurn

```typescript
type GameTurn = "PLAYER_TURN" | "ENEMY_TURN";
```

### ShipVariant

```typescript
type ShipVariant = "small" | "medium" | "large" | "xlarge";
```

## Constantes

### Tamaños de Barcos

```typescript
const SHIP_SIZES = {
  small: 2,
  medium: 3,
  large: 4,
  xlarge: 5,
} as const;
```

### Configuración de Cuadrícula

```typescript
const GRID_SIZE = 10;
const GRID_CELL_SIZE = 0.5;
```

### Posiciones de Cámara

```typescript
const PLAYER_CAMERA_POSITION = {
  position: [0, 15, 10] as [number, number, number],
  rotation: [-Math.PI / 4, 0, 0] as [number, number, number],
};
```

## Hooks Personalizados

### useGameStore

```typescript
const useGameStore = create<GameState>((set, get) => ({ ... }));
```

### useCameraEvents

```typescript
const useCameraEvents = (options?: UseCameraEventsOptions): UseCameraEventsReturn => { ... };
```

### usePerformanceMonitor

```typescript
const usePerformanceMonitor = (enabled?: boolean) => { ... };
```

## Comandos de Desarrollo

### Scripts Disponibles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
npm run lint             # Verificar código
npm run run:deterministic # Simulación determinística
```

## Configuración

### Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Jest

```typescript
// jest.config.js
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```

### TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
``` 