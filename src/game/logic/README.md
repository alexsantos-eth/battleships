# Game Logic Module

Este módulo contiene toda la lógica del juego separada de la lógica visual, permitiendo pruebas unitarias exhaustivas.

## Estructura

### `battleship.ts`
- **BattleshipGame**: Clase principal que maneja toda la lógica del juego
- **Interfaces**: Ship, Shot, GameBoard, Position
- **Funcionalidades**:
  - Gestión de turnos
  - Colocación de barcos
  - Disparos y detección de impactos
  - Destrucción de barcos
  - Estado del juego (victoria/derrota)

### `camera.ts`
- **CameraController**: Clase para manejar la lógica de la cámara
- **Interfaces**: CameraPosition, CameraRotation, CameraState
- **Funcionalidades**:
  - Posiciones predefinidas de la cámara
  - Cálculos de distancia y interpolación
  - Gestión de perspectivas

### `shipGenerator.ts`
- **ShipGenerator**: Clase para generar barcos aleatoriamente
- **Funcionalidades**:
  - Generación de posiciones aleatorias válidas
  - Validación de colocación de barcos
  - Configuración de tipos y cantidades de barcos

### `math.ts`
- **MathUtils**: Utilidades matemáticas reutilizables
- **Funcionalidades**:
  - Cálculos de distancia 2D y 3D
  - Interpolación lineal
  - Utilidades de aleatorización
  - Conversiones de ángulos
  - Validaciones de límites

## Configuración de Pruebas Unitarias

### 1. Instalar dependencias
```bash
npm install --save-dev jest @types/jest ts-jest
```

### 2. Configurar Jest
Crear `jest.config.js` en la raíz del proyecto:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### 3. Agregar scripts al package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Ejecutar pruebas
```bash
npm test
npm run test:watch
npm run test:coverage
```

## Ejemplos de Pruebas

### Pruebas de Lógica del Juego
```typescript
import { BattleshipGame } from '../battleship';

describe('BattleshipGame', () => {
  let game: BattleshipGame;

  beforeEach(() => {
    game = new BattleshipGame(10, 10);
  });

  test('should start with player turn', () => {
    expect(game.getCurrentTurn()).toBe('PLAYER_TURN');
  });

  test('should toggle turn correctly', () => {
    game.toggleTurn();
    expect(game.getCurrentTurn()).toBe('ENEMY_TURN');
  });
});
```

### Pruebas de Matemáticas
```typescript
import { MathUtils } from '../math';

describe('MathUtils', () => {
  test('should calculate distance correctly', () => {
    const distance = MathUtils.distance2D({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(distance).toBe(5);
  });

  test('should interpolate correctly', () => {
    const result = MathUtils.lerp(0, 10, 0.5);
    expect(result).toBe(5);
  });
});
```

### Pruebas de Cámara
```typescript
import { CameraController } from '../camera';

describe('CameraController', () => {
  let controller: CameraController;

  beforeEach(() => {
    controller = new CameraController();
  });

  test('should set player perspective correctly', () => {
    const state = controller.setPlayerPerspective(true);
    expect(controller.isInPlayerPerspective()).toBe(true);
  });
});
```

## Beneficios de esta Arquitectura

1. **Separación de Responsabilidades**: La lógica del juego está completamente separada de la lógica visual
2. **Testabilidad**: Cada módulo puede ser probado independientemente
3. **Reutilización**: La lógica puede ser reutilizada en diferentes contextos (web, móvil, etc.)
4. **Mantenibilidad**: Cambios en la lógica no afectan la interfaz visual
5. **Debugging**: Es más fácil encontrar y corregir errores en la lógica

## Próximos Pasos

1. Configurar Jest y ejecutar las pruebas existentes
2. Agregar más pruebas para cubrir todos los casos edge
3. Implementar pruebas de integración
4. Agregar pruebas de rendimiento para algoritmos complejos
5. Configurar CI/CD para ejecutar pruebas automáticamente 