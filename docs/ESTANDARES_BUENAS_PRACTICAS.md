# 🏗️ Estándares y Buenas Prácticas para Armada.io

Este documento implementa los estándares y buenas prácticas para construir aplicaciones altamente escalables, adaptados específicamente para nuestro proyecto Armada.io desarrollado con React, TypeScript y Three.js.

## 📋 Índice

1. [Estructura de Directorios](#estructura-de-directorios)
2. [Convenciones de Nomenclatura](#convenciones-de-nomenclatura)
3. [Gestión de Estado](#gestión-de-estado)
4. [Componentes](#componentes)
5. [Hooks](#hooks)
6. [Servicios](#servicios)
7. [Tipos y Interfaces](#tipos-y-interfaces)
8. [Testing](#testing)
9. [Performance](#performance)
10. [Documentación](#documentación)

## 🗂️ Estructura de Directorios

### Estructura Actual vs Propuesta

```
src/
├── 📁 components/           # Componentes React
│   ├── 📁 ui/              # Componentes de UI reutilizables
│   ├── 📁 features/        # Componentes específicos de features
│   └── 📁 layouts/         # Componentes de layout
├── 📁 hooks/               # Hooks personalizados
├── 📁 stores/              # Estado global (Zustand)
├── 📁 services/            # Servicios y APIs
├── 📁 types/               # Tipos y interfaces
├── 📁 utils/               # Utilidades y helpers
├── 📁 constants/           # Constantes del proyecto
├── 📁 config/              # Configuraciones
├── 📁 pages/               # Páginas de la aplicación
└── 📁 game/                # Lógica específica del juego
```

### Principios de Organización

1. **Separación por Responsabilidad**: Cada carpeta tiene una responsabilidad específica
2. **Agrupación Lógica**: Componentes relacionados se agrupan juntos
3. **Escalabilidad**: Estructura que soporta el crecimiento del proyecto
4. **Mantenibilidad**: Fácil navegación y localización de archivos

## 🏷️ Convenciones de Nomenclatura

### Archivos y Carpetas

```typescript
// ✅ Correcto
components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Modal/
│       ├── Modal.tsx
│       ├── Modal.test.tsx
│       └── index.ts
├── features/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx
│   │   ├── GameBoard.test.tsx
│   │   └── index.ts
│   └── ShipPlacement/
│       ├── ShipPlacement.tsx
│       ├── ShipPlacement.test.tsx
│       └── index.ts
└── layouts/
    ├── GameLayout/
    │   ├── GameLayout.tsx
    │   ├── GameLayout.test.tsx
    │   └── index.ts
    └── MainLayout/
        ├── MainLayout.tsx
        ├── MainLayout.test.tsx
        └── index.ts
```

### Nomenclatura de Componentes

```typescript
// ✅ Componentes de UI (reutilizables)
Button, Modal, Input, Card, Badge

// ✅ Componentes de Features (específicos)
GameBoard, ShipPlacement, BattleSimulation

// ✅ Componentes de Layout
GameLayout, MainLayout, SidebarLayout

// ✅ Hooks personalizados
useGameState, useShipPlacement, useBattleLogic

// ✅ Stores
gameStore, userStore, settingsStore

// ✅ Servicios
gameService, userService, analyticsService
```

## 🎯 Gestión de Estado

### Estructura de Stores (Zustand)

```typescript
// stores/gameStore.ts
export interface GameState {
  // Estado
  currentTurn: GameTurn;
  playerShips: Ship[];
  enemyShips: Ship[];
  playerShots: Shot[];
  enemyShots: Shot[];
  isGameOver: boolean;
  winner: Winner | null;
  
  // Acciones
  setPlayerTurn: () => void;
  setEnemyTurn: () => void;
  addPlayerShot: (shot: Shot) => void;
  addEnemyShot: (shot: Shot) => void;
  initializeGame: (config?: GameConfig) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Estado inicial
  currentTurn: "PLAYER_TURN",
  playerShips: [],
  enemyShips: [],
  playerShots: [],
  enemyShots: [],
  isGameOver: false,
  winner: null,
  
  // Acciones
  setPlayerTurn: () => set({ currentTurn: "PLAYER_TURN" }),
  setEnemyTurn: () => set({ currentTurn: "ENEMY_TURN" }),
  addPlayerShot: (shot) => set((state) => ({
    playerShots: [...state.playerShots, shot]
  })),
  // ... más acciones
}));
```

### Principios de Estado

1. **Inmutabilidad**: Nunca modificar el estado directamente
2. **Atomicidad**: Cada acción debe ser atómica y consistente
3. **Predictibilidad**: El estado debe ser predecible y debuggable
4. **Separación**: Separar estado local de estado global

## 🧩 Componentes

### Estructura de Componentes

```typescript
// components/ui/Button/Button.tsx
import React from 'react';
import { ButtonProps } from './Button.types';
import { StyledButton } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

// components/ui/Button/Button.types.ts
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

### Principios de Componentes

1. **Composición**: Preferir composición sobre herencia
2. **Props Simples**: Mantener props simples y tipadas
3. **Responsabilidad Única**: Cada componente tiene una responsabilidad
4. **Reutilización**: Componentes reutilizables y configurables

## 🎣 Hooks

### Estructura de Hooks

```typescript
// hooks/useGameState.ts
import { useGameStore } from '@/stores/gameStore';
import { useCallback, useMemo } from 'react';

export const useGameState = () => {
  const {
    currentTurn,
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    isGameOver,
    winner,
    setPlayerTurn,
    setEnemyTurn,
    addPlayerShot,
    addEnemyShot,
  } = useGameStore();

  const isPlayerTurn = useMemo(() => currentTurn === 'PLAYER_TURN', [currentTurn]);
  const isEnemyTurn = useMemo(() => currentTurn === 'ENEMY_TURN', [currentTurn]);

  const getShipAtPosition = useCallback((x: number, y: number, isPlayerBoard: boolean) => {
    const ships = isPlayerBoard ? playerShips : enemyShips;
    return ships.find(ship => {
      const cells = getShipCells(ship);
      return cells.some(([shipX, shipY]) => shipX === x && shipY === y);
    });
  }, [playerShips, enemyShips]);

  return {
    // Estado
    currentTurn,
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    isGameOver,
    winner,
    isPlayerTurn,
    isEnemyTurn,
    
    // Acciones
    setPlayerTurn,
    setEnemyTurn,
    addPlayerShot,
    addEnemyShot,
    
    // Utilidades
    getShipAtPosition,
  };
};
```

### Principios de Hooks

1. **Composición**: Combinar hooks simples en hooks complejos
2. **Memoización**: Usar useMemo y useCallback apropiadamente
3. **Cleanup**: Limpiar efectos y suscripciones
4. **Testing**: Hooks deben ser testables

## 🔧 Servicios

### Estructura de Servicios

```typescript
// services/gameService.ts
import { GameConfig, GameState, Ship, Shot } from '@/types/game';

export class GameService {
  private static instance: GameService;

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  async initializeGame(config: GameConfig): Promise<GameState> {
    try {
      const playerShips = this.generateShips(config);
      const enemyShips = this.generateShips(config);
      
      return {
        currentTurn: 'PLAYER_TURN',
        playerShips,
        enemyShips,
        playerShots: [],
        enemyShots: [],
        isGameOver: false,
        winner: null,
      };
    } catch (error) {
      throw new Error(`Failed to initialize game: ${error}`);
    }
  }

  private generateShips(config: GameConfig): Ship[] {
    // Lógica de generación de barcos
  }

  checkShot(x: number, y: number, ships: Ship[]): { hit: boolean; shipId?: number } {
    // Lógica de verificación de disparo
  }
}

export const gameService = GameService.getInstance();
```

### Principios de Servicios

1. **Singleton**: Usar patrón singleton para servicios
2. **Error Handling**: Manejo robusto de errores
3. **Async/Await**: Usar async/await para operaciones asíncronas
4. **Testing**: Servicios deben ser testables

## 📝 Tipos y Interfaces

### Estructura de Tipos

```typescript
// types/game.ts
export type GameTurn = 'PLAYER_TURN' | 'ENEMY_TURN';
export type Winner = 'player' | 'enemy' | null;
export type ShipVariant = 'small' | 'medium' | 'large' | 'xlarge';
export type ShipOrientation = 'horizontal' | 'vertical';

export interface Ship {
  id: string;
  coords: [number, number];
  variant: ShipVariant;
  orientation: ShipOrientation;
  health: number;
}

export interface Shot {
  id: string;
  x: number;
  y: number;
  hit: boolean;
  shipId?: string;
  timestamp: number;
}

export interface GameState {
  currentTurn: GameTurn;
  playerShips: Ship[];
  enemyShips: Ship[];
  playerShots: Shot[];
  enemyShots: Shot[];
  isGameOver: boolean;
  winner: Winner;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  shipCounts: Record<ShipVariant, number>;
}
```

### Principios de Tipos

1. **Explicitud**: Tipos explícitos y descriptivos
2. **Reutilización**: Tipos reutilizables y composables
3. **Documentación**: Tipos autodocumentados
4. **Consistencia**: Convenciones consistentes

## 🧪 Testing

### Estructura de Tests

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with custom variant', () => {
      render(<Button variant="secondary">Click me</Button>);
      expect(screen.getByRole('button')).toHaveClass('secondary');
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

### Principios de Testing

1. **Cobertura**: Mantener alta cobertura de tests
2. **Organización**: Tests organizados por funcionalidad
3. **Isolación**: Tests independientes y aislados
4. **Legibilidad**: Tests legibles y mantenibles

## ⚡ Performance

### Optimizaciones

```typescript
// Optimización de componentes
import React, { memo, useCallback, useMemo } from 'react';

export const GameBoard = memo(({ ships, shots, onCellClick }: GameBoardProps) => {
  const boardCells = useMemo(() => {
    return generateBoardCells(ships, shots);
  }, [ships, shots]);

  const handleCellClick = useCallback((x: number, y: number) => {
    onCellClick(x, y);
  }, [onCellClick]);

  return (
    <div className="game-board">
      {boardCells.map(cell => (
        <Cell
          key={`${cell.x}-${cell.y}`}
          {...cell}
          onClick={handleCellClick}
        />
      ))}
    </div>
  );
});

// Optimización de hooks
export const useGameState = () => {
  const gameState = useGameStore();
  
  const memoizedState = useMemo(() => ({
    isPlayerTurn: gameState.currentTurn === 'PLAYER_TURN',
    isEnemyTurn: gameState.currentTurn === 'ENEMY_TURN',
    totalShots: gameState.playerShots.length + gameState.enemyShots.length,
  }), [gameState.currentTurn, gameState.playerShots.length, gameState.enemyShots.length]);

  return { ...gameState, ...memoizedState };
};
```

### Principios de Performance

1. **Memoización**: Usar React.memo, useMemo, useCallback
2. **Lazy Loading**: Cargar componentes y recursos bajo demanda
3. **Bundle Splitting**: Dividir el bundle en chunks
4. **Profiling**: Monitorear performance regularmente

## 📚 Documentación

### Estructura de Documentación

```markdown
# Componente Button

Componente de botón reutilizable con múltiples variantes y tamaños.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'danger' | 'primary' | Variante visual del botón |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Tamaño del botón |
| disabled | boolean | false | Si el botón está deshabilitado |
| onClick | () => void | - | Función llamada al hacer click |

## Ejemplos

```tsx
import { Button } from '@/components/ui/Button';

// Botón primario
<Button onClick={handleClick}>Click me</Button>

// Botón secundario deshabilitado
<Button variant="secondary" disabled>Disabled</Button>
```

## Testing

El componente incluye tests completos que cubren:
- Renderizado con diferentes props
- Interacciones de usuario
- Estados deshabilitados
- Accesibilidad
```

### Principios de Documentación

1. **Completitud**: Documentar todas las APIs públicas
2. **Ejemplos**: Incluir ejemplos prácticos
3. **Actualización**: Mantener documentación actualizada
4. **Claridad**: Documentación clara y concisa

## 🚀 Implementación

### Plan de Migración

1. **Fase 1**: Reorganización de estructura de directorios
2. **Fase 2**: Refactorización de componentes existentes
3. **Fase 3**: Implementación de nuevos estándares
4. **Fase 4**: Testing y documentación
5. **Fase 5**: Optimización de performance

### Checklist de Implementación

- [ ] Crear nueva estructura de directorios
- [ ] Migrar componentes a nueva estructura
- [ ] Implementar convenciones de nomenclatura
- [ ] Refactorizar stores y hooks
- [ ] Crear servicios centralizados
- [ ] Implementar tipos y interfaces
- [ ] Mejorar cobertura de tests
- [ ] Optimizar performance
- [ ] Actualizar documentación

---

Este documento establece los estándares y buenas prácticas que seguiremos en el desarrollo de Armada.io, asegurando un código mantenible, escalable y de alta calidad. 