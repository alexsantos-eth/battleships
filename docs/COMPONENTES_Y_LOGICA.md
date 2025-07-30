# Componentes y Lógica - Estructura del Proyecto

## Visión General

El proyecto sigue una arquitectura modular y organizada dentro del directorio `src/bundle/` que separa claramente los componentes visuales de la lógica de negocio. Esta estructura facilita el mantenimiento, la reutilización y la escalabilidad del código.

## Estructura de Carpetas

### 📁 Carpetas de Componentes (PascalCase)

Las carpetas que contienen componentes React usan **PascalCase** para su nomenclatura:

#### `/components/` - Componentes de UI Interactivos
```
components/
├── Cell/                 # Celdas individuales del grid
├── Droplet/              # Efectos de gotas de agua
├── EnemyShotsGrid/       # Grid de disparos del enemigo
├── Game/                 # Componente principal del juego
├── GameGrid/             # Grid del juego
├── GridHelper/           # Utilidades de visualización del grid
├── PlayerShotsGrid/      # Grid de disparos del jugador
├── PressGrid/            # Grid interactivo para clicks
└── WaterExplosion/       # Efectos de explosión de agua
```

#### `/layers/` - Capas de Renderizado 3D
```
layers/
├── RocksPlane/           # Capa de rocas del fondo
├── SandPlane/            # Capa de arena/terreno
├── ShipsPlane/           # Capa de barcos
├── TreePlane/            # Capa de árboles
└── WaterPlane/           # Capa de agua
```

#### `/primitives/` - Elementos Primitivos 3D
```
primitives/
├── Rock/                 # Elemento roca
├── Ship/                 # Elemento barco
├── SplashRing/           # Anillo de salpicadura
└── Tree/                 # Elemento árbol
```

#### `/env/` - Entorno y Configuración 3D
```
env/
├── Canvas/               # Configuración del canvas
├── Controls/             # Controles de cámara
└── Lights/               # Configuración de iluminación
```

#### `/camera/` - Control de Cámara
```
camera/
└── CameraController/     # Controlador de cámara
```

### 📁 Carpetas de Lógica (camelCase)

Las carpetas que contienen lógica, utilidades y estado usan **camelCase** y se organizan por funcionalidad:

#### `/hooks/` - Hooks Personalizados
```
hooks/
├── camera/               # Hooks relacionados con cámara
│   └── useCameraEvents.ts
├── grid/                 # Hooks relacionados con grid
│   ├── useCellPositions.ts
│   └── useGridDimensions.ts
└── __tests__/           # Tests de hooks
```

#### `/tools/` - Utilidades y Cálculos
```
tools/
└── grid/                # Utilidades de grid
    └── calculations.ts   # Cálculos de posicionamiento
```

#### `/stores/` - Estado Global
```
stores/
└── game/                # Estado del juego
    ├── gameStore.ts     # Store principal del juego
    └── __tests__/       # Tests del store
```

#### `/controller/` - Lógica de Control
```
controller/
└── enemy/               # Lógica del enemigo
    └── hooks/
        └── useEnemyAI.ts # IA del enemigo
```

## Convenciones de Nomenclatura

### Componentes (PascalCase)
- **Carpetas**: `ComponentName/`
- **Archivos**: `ComponentName.tsx`
- **Tipos**: `ComponentName.types.ts`
- **Índice**: `index.ts`

### Lógica (camelCase)
- **Carpetas**: `functionality/`
- **Archivos**: `useHookName.ts`, `toolName.ts`
- **Máximo un nivel de profundidad**: `functionality/subcategory/`

## Organización por Funcionalidad

### 🎮 Game (Juego)
- **Componentes**: `Game/`, `GameGrid/`
- **Hooks**: `useCellPositions`, `useEnemyAI`
- **Stores**: `gameStore`
- **Tools**: Cálculos de barcos y grid

### 🎯 Grid (Cuadrícula)
- **Componentes**: `Cell/`, `PlayerShotsGrid/`, `EnemyShotsGrid/`, `PressGrid/`
- **Hooks**: `useGridDimensions`, `useCellPositions`
- **Tools**: `calculations.ts`

### 🎥 Camera (Cámara)
- **Componentes**: `CameraController/`
- **Hooks**: `useCameraEvents`
- **Env**: `Controls/`

### 🌊 Environment (Entorno)
- **Layers**: `WaterPlane/`, `SandPlane/`, `RocksPlane/`, `TreePlane/`
- **Primitives**: `Ship/`, `Rock/`, `Tree/`, `SplashRing/`
- **Env**: `Canvas/`, `Lights/`

## Buenas Prácticas

### 1. Reutilización de Tipos
```typescript
// ✅ Correcto - Reutilizar tipos existentes
import type { GameStoreShip } from "@/types/game/common";
import type { Shot } from "@/types/game/common";

// ❌ Incorrecto - Duplicar definiciones
interface Ship {
  coords: [number, number];
  variant: string;
}
```

### 2. Centralización de Lógica
```typescript
// ✅ Correcto - Lógica centralizada en tools
import { generateGridCells } from "@/bundle/tools/grid/calculations";

// ❌ Incorrecto - Lógica duplicada en componentes
const cells = [];
for (let x = 0; x < boardWidth; x++) {
  // Lógica duplicada...
}
```

### 3. Hooks Personalizados
```typescript
// ✅ Correcto - Hook que combina múltiples funcionalidades
const { cells, handleCellClick } = useCellPositions(isPlayerGrid);

// ❌ Incorrecto - Múltiples hooks en componente
const gameStore = useGameStore();
const gridDimensions = useGridDimensions();
const { isCellShot, playerShots } = gameStore;
```

### 4. Exportaciones Organizadas
```typescript
// ✅ Correcto - Exportaciones centralizadas
// layers/index.ts
export { WaterPlane } from "./WaterPlane";
export type { WaterPlaneProps } from "./WaterPlane/WaterPlane.types";

// ❌ Incorrecto - Importaciones directas
import { WaterPlane } from "./layers/WaterPlane/WaterPlane";
```

## Estructura de Archivos por Componente

### Componente Completo
```
ComponentName/
├── ComponentName.tsx          # Componente principal
├── ComponentName.types.ts     # Tipos y interfaces
└── index.ts                   # Exportaciones
```

### Componente con Lógica Compleja
```
ComponentName/
├── ComponentName.tsx          # Componente principal
├── ComponentName.types.ts     # Tipos y interfaces
├── tools/                     # Utilidades específicas
│   └── calculations.ts
└── index.ts                   # Exportaciones
```

### Hook Personalizado
```
hooks/
├── functionality/              # Agrupación por funcionalidad
│   └── useHookName.ts         # Hook específico
└── __tests__/                 # Tests
```

## Flujo de Datos

### 1. Estado Global (Stores)
```typescript
// stores/game/gameStore.ts
export const useGameStore = create<GameState>((set, get) => ({
  // Estado del juego
}));
```

### 2. Lógica de Negocio (Tools)
```typescript
// tools/grid/calculations.ts
export function generateGridCells() {
  // Lógica de posicionamiento
}
```

### 3. Hooks Personalizados
```typescript
// hooks/grid/useCellPositions.ts
export const useCellPositions = (isPlayerGrid: boolean) => {
  // Combina stores y tools
};
```

### 4. Componentes
```typescript
// components/PlayerShotsGrid/PlayerShotsGrid.tsx
export const PlayerShotsGrid = () => {
  const { cells } = useCellPositions(true);
  // Renderizado
};
```

## Ventajas de esta Estructura

1. **Separación de Responsabilidades**: Componentes visuales separados de lógica de negocio
2. **Reutilización**: Hooks y tools centralizados
3. **Mantenibilidad**: Estructura clara y organizada
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Testing**: Tests organizados por funcionalidad
6. **Tipado**: Tipos reutilizables y consistentes

## Reglas de Organización

1. **PascalCase** para carpetas de componentes
2. **camelCase** para carpetas de lógica
3. **Máximo un nivel** de profundidad en carpetas de lógica
4. **Agrupación por funcionalidad** en lugar de por tipo
5. **Reutilización de tipos** existentes
6. **Centralización de lógica** en tools y hooks
7. **Exportaciones organizadas** en index.ts 