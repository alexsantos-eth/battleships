# Guía de Desarrollo - Armada.io

## Configuración del Entorno

### Requisitos Previos

- **Node.js**: Versión 20 o superior (usar `nvm use 20`)
- **npm**: Gestor de paquetes
- **Git**: Control de versiones

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd armada-io
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar instalación**
```bash
npm run dev
```

El servidor de desarrollo debería iniciarse en `http://localhost:5173`

## Estructura del Proyecto

### Organización de Archivos

```
src/
├── components/          # Componentes React reutilizables
│   ├── __tests__/      # Tests de componentes
│   ├── GameGrid/       # Tablero principal del juego
│   ├── PressGrid/      # Interacción de disparos
│   ├── ShipsPlane/     # Renderizado de barcos
│   └── ...
├── game/logic/         # Lógica del juego
│   ├── __tests__/      # Tests de lógica
    │   ├── armada.ts   # Clase principal del juego
│   ├── shipGenerator.ts # Generación de barcos
│   └── ...
├── stores/             # Estado global (Zustand)
├── hooks/              # Hooks personalizados
├── utils/              # Utilidades y helpers
├── env/                # Configuración del entorno 3D
└── ui/                 # Componentes de interfaz
```

### Convenciones de Nomenclatura

- **Componentes**: PascalCase (`GameGrid.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useCameraEvents.ts`)
- **Utilidades**: camelCase (`eventBus.ts`)
- **Tipos**: PascalCase (`GameState`, `Ship`)
- **Constantes**: UPPER_SNAKE_CASE (`GRID_SIZE`)

## Flujo de Desarrollo

### 1. Crear una Nueva Rama

```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollo

#### Agregar Nuevos Componentes

1. **Crear el componente**
```typescript
// src/components/NuevoComponente/index.tsx
import React from 'react';

interface NuevoComponenteProps {
  // Props del componente
}

const NuevoComponente: React.FC<NuevoComponenteProps> = ({ /* props */ }) => {
  return (
    <div>
      {/* Contenido del componente */}
    </div>
  );
};

export default NuevoComponente;
```

2. **Crear tests**
```typescript
// src/components/NuevoComponente/__tests__/NuevoComponente.test.tsx
import { render, screen } from '@testing-library/react';
import NuevoComponente from '../index';

describe('NuevoComponente', () => {
  it('should render correctly', () => {
    render(<NuevoComponente />);
    // Assertions
  });
});
```

3. **Exportar el componente**
```typescript
// src/components/index.ts
export { default as NuevoComponente } from './NuevoComponente';
```

#### Agregar Nueva Lógica de Juego

1. **Crear la función en game/logic/**
```typescript
// src/game/logic/nuevaLogica.ts
export function nuevaFuncion() {
  // Implementación
}
```

2. **Crear tests**
```typescript
// src/game/logic/__tests__/nuevaLogica.test.ts
import { nuevaFuncion } from '../nuevaLogica';

describe('nuevaFuncion', () => {
  it('should work correctly', () => {
    // Tests
  });
});
```

#### Modificar el Estado Global

1. **Agregar al store**
```typescript
// src/stores/gameStore.ts
export interface GameState {
  // ... estado existente
  nuevaPropiedad: string;
}

export const useGameStore = create<GameState>((set, get) => ({
  // ... estado existente
  nuevaPropiedad: '',
  
  setNuevaPropiedad: (valor: string) => {
    set({ nuevaPropiedad: valor });
  },
}));
```

### 3. Testing

#### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

#### Escribir Tests Efectivos

```typescript
// Ejemplo de test para componente
describe('GameGrid', () => {
  it('should render player and enemy boards', () => {
    render(<GameGrid />);
    expect(screen.getByTestId('player-board')).toBeInTheDocument();
    expect(screen.getByTestId('enemy-board')).toBeInTheDocument();
  });
});

// Ejemplo de test para lógica
describe('checkShot', () => {
  it('should return hit when shot hits ship', () => {
    const game = new ArmadaGame();
    game.addShip('enemy', {
      position: { x: 0, y: 0 },
      variant: 'small',
      orientation: 'horizontal'
    });
    
    const result = game.fireShot('player', { x: 0, y: 0 });
    expect(result.hit).toBe(true);
  });
});
```

### 4. Linting y Formateo

```bash
# Verificar código
npm run lint

# Formatear código (si tienes prettier configurado)
npx prettier --write src/
```

### 5. Commit y Push

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad de disparo"

# Push a la rama
git push origin feature/nueva-funcionalidad
```

## Patrones de Desarrollo

### 1. Gestión de Estado

#### Usar Zustand para Estado Global

```typescript
// ✅ Correcto
const { currentTurn, setPlayerTurn } = useGameStore();

// ❌ Incorrecto - No usar useState para estado global
const [currentTurn, setCurrentTurn] = useState('PLAYER_TURN');
```

#### Estado Local para Componentes

```typescript
// ✅ Correcto - Estado local específico del componente
const [isHovered, setIsHovered] = useState(false);
```

### 2. Eventos y Comunicación

#### Usar EventBus para Comunicación Entre Componentes

```typescript
// ✅ Correcto
eventBus.emit(EVENTS.CAMERA_SHOOT_START);

// ❌ Incorrecto - No usar props drilling excesivo
```

### 3. Optimización de Rendimiento

#### Usar useRef para Referencias Estables

```typescript
// ✅ Correcto
const meshRef = useRef<THREE.Mesh>(null);

// ❌ Incorrecto
const meshRef = useRef<THREE.Mesh | null>(null);
```

#### Memoización de Cálculos Costosos

```typescript
// ✅ Correcto
const shipCells = useMemo(() => 
  getShipCells(ship.position, ship.size, ship.orientation),
  [ship.position, ship.size, ship.orientation]
);
```

### 4. Gestión de Efectos 3D

#### Cleanup de Objetos 3D

```typescript
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

## Debugging

### 1. Herramientas de Desarrollo

#### React DevTools
- Instalar extensión del navegador
- Inspeccionar estado de componentes
- Verificar props y hooks

#### Three.js Inspector
```typescript
// Agregar temporalmente para debugging
import { OrbitControls } from '@react-three/drei';

// En el componente
<OrbitControls />
```

### 2. Logging

#### Debug Helper
```typescript
// src/utils/debug.ts
export const debug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};
```

### 3. Performance Monitoring

```typescript
// Usar el componente PerformanceMonitor
<PerformanceMonitor 
  enabled={process.env.NODE_ENV === 'development'}
  position="top-right"
/>
```

## Deployment

### 1. Build de Producción

```bash
npm run build
```

### 2. Preview del Build

```bash
npm run preview
```

### 3. Deployment en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Troubleshooting

### Problemas Comunes

#### 1. Errores de Node.js
```bash
# Usar Node.js 20
nvm use 20
```

#### 2. Errores de TypeScript
```bash
# Verificar tipos
npx tsc --noEmit
```

#### 3. Errores de Three.js
- Verificar que las geometrías se dispongan correctamente
- Comprobar que los materiales se limpien
- Verificar referencias de objetos 3D

#### 4. Problemas de Performance
- Usar `useFrame` para animaciones
- Implementar frustum culling
- Optimizar geometrías y materiales

### Debugging de Eventos

```typescript
// Agregar logging temporal
eventBus.on('*', (event, ...args) => {
  console.log(`Event: ${event}`, args);
});
```

## Contribución

### 1. Pull Request

1. **Crear PR desde tu rama**
2. **Describir cambios claramente**
3. **Incluir tests si aplica**
4. **Verificar que todos los tests pasen**

### 2. Code Review

#### Checklist
- [ ] Código sigue las convenciones
- [ ] Tests incluidos y pasando
- [ ] Documentación actualizada
- [ ] No hay console.logs en producción
- [ ] Performance no degradada

### 3. Merge

- **Squash commits** antes del merge
- **Usar mensajes descriptivos**
- **Verificar que el build funcione**

## Recursos Adicionales

### Documentación
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/docs/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Herramientas
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Three.js Inspector](https://github.com/jeromeetienne/threejs-inspector)
- [VSCode Extensions](https://marketplace.visualstudio.com/)

### Comunidad
- [React Three Fiber Discord](https://discord.gg/ZZjjNvJ)
- [Three.js Forum](https://discourse.threejs.org/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/three.js)

---

**¡Gracias por contribuir a Armada.io! 🚢💥** 