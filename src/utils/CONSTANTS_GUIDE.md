# 🎯 Guía de Constantes Centralizadas

Este documento describe todas las constantes que han sido centralizadas en `src/utils/constants.ts` para facilitar su edición y mantenimiento futuro.

## 📁 Estructura de Constantes

### 🎮 GAME_CONSTANTS

#### BOARD (Configuración del Tablero)
```typescript
BOARD: {
  DEFAULT_WIDTH: 10,        // Ancho por defecto del tablero
  DEFAULT_HEIGHT: 10,       // Alto por defecto del tablero
  MIN_SIZE: 5,              // Tamaño mínimo del tablero
  MAX_SIZE: 15,             // Tamaño máximo del tablero
  GRID_SPACING: 0.5,        // Espaciado entre celdas
  SHIP_SPACING: 0.5,        // Espaciado de barcos
}
```

#### SHIPS (Configuración de Barcos)
```typescript
SHIPS: {
  SIZES: {
    small: 2,               // Tamaño del barco pequeño
    medium: 3,              // Tamaño del barco mediano
    large: 4,               // Tamaño del barco grande
    xlarge: 5,              // Tamaño del barco extra grande
  },
  DEFAULT_COUNTS: {
    small: 4,               // Cantidad por defecto de barcos pequeños
    medium: 3,              // Cantidad por defecto de barcos medianos
    large: 2,               // Cantidad por defecto de barcos grandes
    xlarge: 1,              // Cantidad por defecto de barcos extra grandes
  },
  MIN_DISTANCE: 2,          // Distancia mínima entre barcos
  MAX_PLACEMENT_ATTEMPTS: 200,  // Máximo intentos de colocación
  MAX_GENERATION_ATTEMPTS: 1000, // Máximo intentos de generación
}
```

#### CAMERA (Configuración de Cámara)
```typescript
CAMERA: {
  MOBILE_BREAKPOINT: 768,   // Breakpoint para dispositivos móviles
  POSITIONS: {
    PLAYER: {               // Posición de cámara del jugador
      position: [0, -4, 4],
      rotation: [1.1, 0, 0],
      mobile: {             // Posición para móviles
        position: [0, -2, 4],
        rotation: [1.05, 0, 0],
      },
    },
    ENEMY: {                // Posición de cámara del enemigo
      position: [0, 9, 4],
      rotation: [0, 0, 0],
    },
    PERSPECTIVE: {          // Posición de perspectiva
      position: [0, 0, 6],
      rotation: [0, 0, 0],
    },
  },
  SETTINGS: {
    far: 1500,              // Distancia lejana de la cámara
    near: 0.5,              // Distancia cercana de la cámara
    animationSpeed: 0.15,   // Velocidad de animación
    eventThrottleMs: 16,    // Throttle de eventos
    animationThrottleMs: 8, // Throttle de animación
    positionThreshold: 0.00001, // Umbral de posición
    rotationThreshold: 0.005,   // Umbral de rotación
  },
  PERFORMANCE: {
    slowDeviceCores: 4,     // Número de cores para dispositivo lento
    pixelRatioReduction: 0.8, // Reducción de ratio de píxeles
    fpsWarningThreshold: 20,   // Umbral de advertencia FPS
    ratioReductionFactor: 0.9, // Factor de reducción de ratio
  },
}
```

#### ANIMATIONS (Configuración de Animaciones)
```typescript
ANIMATIONS: {
  DROPLET: {
    distance: 0.5,          // Distancia de las gotas
    startZ: 0.15,           // Posición Z inicial
    endZ: 0.5,              // Posición Z final
    startOpacity: 1,        // Opacidad inicial
    endOpacity: 0,          // Opacidad final
    duration: 400,          // Duración de animación
    count: 10,              // Cantidad de gotas
  },
  SHOT: {
    defaultDelay: 500,      // Delay por defecto de disparo
    hitDelay: 1000,         // Delay de impacto
    missDelay: 600,         // Delay de fallo
    visualHitDelay: 1200,   // Delay visual de impacto
    visualMissDelay: 800,   // Delay visual de fallo
  },
  WAVE: {
    frequencyMultiplier: 0.7,   // Multiplicador de frecuencia
    amplitudeMultiplier: 0.5,   // Multiplicador de amplitud
    phaseMultiplier: 0.5,       // Multiplicador de fase
  },
}
```

#### PERFORMANCE (Configuración de Rendimiento)
```typescript
PERFORMANCE: {
  TARGET_FPS: 60,           // FPS objetivo
  DEFAULT_FPS: 60,          // FPS por defecto
  DEFAULT_RENDER_TIME: 16,  // Tiempo de render por defecto
  LOW_PERFORMANCE_THRESHOLD: 0.8, // Umbral de rendimiento bajo
  MEMORY: {
    DEFAULT_USED: 100 * 1024 * 1024,    // Memoria usada por defecto
    DEFAULT_TOTAL: 512 * 1024 * 1024,   // Memoria total por defecto
    WARNING_THRESHOLD: 80,               // Umbral de advertencia
  },
  CPU: {
    BASE_USAGE: 5,          // Uso base de CPU
    MAX_USAGE: 30,          // Uso máximo de CPU
    ACTIVITY_BONUS: 20,     // Bonus por actividad
    VARIATION: 2,           // Variación
    WARNING_THRESHOLD: 70,  // Umbral de advertencia
  },
  SYSTEM: {
    UPDATE_INTERVAL: 2000,  // Intervalo de actualización
    ACTIVITY_TIMEOUT: 1000, // Timeout de actividad
    FRAME_RATE_DIVISOR: 10, // Divisor de frame rate
    BYTES_BASE: 1024,       // Base de bytes
  },
}
```

#### UI (Configuración de Interfaz)
```typescript
UI: {
  POSITIONS: {
    TOP_LEFT: "top-left",       // Posición superior izquierda
    TOP_RIGHT: "top-right",     // Posición superior derecha
    BOTTOM_LEFT: "bottom-left", // Posición inferior izquierda
    BOTTOM_RIGHT: "bottom-right", // Posición inferior derecha
  },
  SPACING: {
    SMALL: "10px",              // Espaciado pequeño
    MEDIUM: "8px",              // Espaciado mediano
    LARGE: "4px",               // Espaciado grande
  },
  Z_INDEX: {
    STATS_PANEL: "1000",        // Z-index del panel de estadísticas
  },
  DIMENSIONS: {
    DEBUG_INFO_MAX_WIDTH: 400,  // Ancho máximo de info de debug
    DEBUG_INFO_MAX_HEIGHT: "80vh", // Alto máximo de info de debug
    MOBILE_ZOOM_MULTIPLIER: 0.19, // Multiplicador de zoom móvil
    DESKTOP_ZOOM: 140,          // Zoom de escritorio
  },
  COLORS: {
    SUCCESS: "#4CAF50",         // Color de éxito
    WARNING: "#FF9800",         // Color de advertencia
    DANGER: "#F44336",          // Color de peligro
  },
}
```

#### GAME_LOGIC (Lógica del Juego)
```typescript
GAME_LOGIC: {
  BATTLE: {
    DEFAULT_MAX_TURNS: 200,     // Máximo turnos por defecto
    MAX_ATTEMPTS: 100,          // Máximo intentos
    RANDOM_TURN_THRESHOLD: 0.5, // Umbral de turno aleatorio
  },
  SHIP_GENERATION: {
    ORIENTATION_RANDOM_THRESHOLD: 0.5, // Umbral de orientación aleatoria
    QUADRANT_SIZE_DIVISOR: 2,   // Divisor de tamaño de cuadrante
  },
  DETERMINISTIC: {
    LCG_MULTIPLIER: 1103515245, // Multiplicador LCG
    LCG_INCREMENT: 12345,       // Incremento LCG
    LCG_MASK: 0x7fffffff,       // Máscara LCG
    BOOLEAN_THRESHOLD: 0.5,     // Umbral booleano
  },
}
```

#### TERRAIN (Configuración de Terreno)
```typescript
TERRAIN: {
  SAND: {
    holeRadius: 0.28,           // Radio del agujero de arena
  },
  GRASS: {
    size: 64,                   // Tamaño del césped
  },
}
```

#### SIMULATION (Configuración de Simulación)
```typescript
SIMULATION: {
  DEFAULT_SEED: 12345,          // Semilla por defecto
  DEFAULT_BOARD_SIZE: 10,       // Tamaño de tablero por defecto
  MAX_SIMULATION_TURNS: 20,     // Máximo turnos de simulación
  QUICK_GAME_TURNS: 2,          // Turnos de juego rápido
  RANDOM_GAME_MAX_TURNS: 15,    // Máximo turnos de juego aleatorio
}
```

## 🚀 Configuraciones Predefinidas

### SHIP_VARIANTS_CONFIG
Configuración detallada de cada variante de barco con URLs de modelos, escalas, y parámetros de animación.

### GAME_CONFIGS
Configuraciones predefinidas para diferentes tipos de juego:
- **QUICK**: Juego rápido (8x8, pocos barcos)
- **CLASSIC**: Juego clásico (10x10, configuración estándar)
- **CHALLENGING**: Juego desafiante (12x12, muchos barcos, IA inteligente)

## 🔧 Archivos Actualizados

Los siguientes archivos han sido actualizados para usar las constantes centralizadas:

### Hooks
- `src/hooks/useSystemMetrics.ts`
- `src/hooks/useGridDimensions.ts`
- `src/hooks/useGameState.ts`

### Componentes
- `src/components/Droplet/calculations.ts`
- `src/components/WaterExplosion/calculations.ts`
- `src/components/Ship/calculations.ts`

### Utilidades
- `src/utils/camera.ts`
- `src/utils/debug.ts`

## 💡 Beneficios

1. **Mantenibilidad**: Todas las constantes están en un solo lugar
2. **Consistencia**: Valores uniformes en todo el proyecto
3. **Flexibilidad**: Fácil modificación de parámetros
4. **Documentación**: Valores claramente documentados
5. **Testing**: Configuración centralizada para pruebas

## 🎯 Uso Futuro

Para modificar cualquier valor del juego:
1. Abrir `src/utils/constants.ts`
2. Localizar la constante deseada
3. Modificar el valor
4. Los cambios se aplicarán automáticamente en todo el proyecto

## 📝 Notas Importantes

- Todas las constantes están tipadas como `as const` para máxima seguridad de tipos
- Los valores están organizados lógicamente por categorías
- Las configuraciones predefinidas facilitan la creación de nuevos tipos de juego
- Los valores están optimizados para rendimiento y experiencia de usuario 