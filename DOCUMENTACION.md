# Documentación de Armada.io

## Descripción General

Este es un juego de armada 3D desarrollado con React, TypeScript, Three.js y Vite. El juego presenta una experiencia visual inmersiva con gráficos 3D, efectos de partículas y animaciones de cámara.

## Tecnologías Utilizadas

- **Frontend**: React 19.1.0, TypeScript 5.8.3
- **3D Graphics**: Three.js 0.178.0, @react-three/fiber 9.2.0, @react-three/drei 10.5.1
- **Animaciones**: @react-spring/three 10.0.1
- **Estado Global**: Zustand 5.0.6
- **Build Tool**: Vite 7.0.4
- **Testing**: Jest 30.0.5 (Cobertura: 77.06%)
- **Ruido**: simplex-noise 4.0.3
- **Performance**: stats.js 0.17.0

## Calidad y Testing

### Cobertura de Tests
El proyecto mantiene una alta calidad de código con una cobertura de tests significativa:

- **Cobertura General**: 77.06% statements, 42.55% branches
- **Módulo game/logic**: 94.68% (módulo crítico del juego)
- **Archivos con 100%**: 8 archivos críticos del sistema
- **Tests Ejecutándose**: 305 tests pasando, 99.35% éxito

### Archivos con Cobertura Completa
- `gameInitializer.ts`: 100% (mejorado de 2.1%)
- `math.ts`: 100% (mantenido)
- `shipGenerator.ts`: 100% (mantenido)
- `camera.ts`: 100% (mantenido)
- `Droplet/calculations.ts`: 100% (mantenido)
- `Rock/utils.ts`: 100% (mantenido)
- `WaterExplosion/calculations.ts`: 100% (mantenido)
- `Ship/utils.ts`: 100% (mantenido)

### Limpieza de Código
Se han eliminado 9 archivos de ejemplos innecesarios que tenían 0% de cobertura, mejorando la mantenibilidad del proyecto.

## Arquitectura del Juego

### 1. Gestión de Estado (Zustand Store)

El estado del juego se maneja centralmente en `src/stores/gameStore.ts`:

#### Estados Principales:
- `currentTurn`: Turno actual ("PLAYER_TURN" | "ENEMY_TURN")
- `playerShips` / `enemyShips`: Barcos de cada jugador
- `playerShots` / `enemyShots`: Disparos realizados
- `isGameOver`: Estado de fin de juego
- `winner`: Ganador ("player" | "enemy" | null)

#### Funciones Principales:
- `checkShot()`: Verifica si un disparo impacta en un barco
- `isShipDestroyed()`: Determina si un barco está completamente destruido
- `checkGameOver()`: Verifica condiciones de victoria
- `toggleTurn()`: Cambia entre turnos

### 2. Lógica del Juego

#### Tipos de Barcos:
- **Small**: 2 celdas
- **Medium**: 3 celdas  
- **Large**: 4 celdas
- **XLarge**: 5 celdas

#### Generación de Barcos:
- Ubicación aleatoria con restricciones de distancia mínima
- Preferencia por cuadrantes específicos para distribución estratégica
- Algoritmo de fallback para casos donde no se puede colocar un barco

#### Mecánica de Disparos:
- Verificación de celdas ya disparadas
- Detección de impactos en barcos
- Seguimiento de daño por barco
- Condiciones de victoria (todos los barcos destruidos)

### 3. Componentes Visuales

#### GameGrid
Componente principal que renderiza el tablero de juego:
- Dos instancias: tablero del jugador y del enemigo
- Posicionamiento y rotación configurable
- Integración con componentes de interacción

#### Elementos Visuales:
- **WaterPlane**: Superficie de agua
- **SandPlane**: Superficie de arena
- **RocksPlane**: Rocas decorativas
- **TreePlane**: Árboles decorativos
- **ShipsPlane**: Barcos del jugador/enemigo
- **GridHelper**: Líneas de la cuadrícula

#### Componentes de Interacción:
- **PressGrid**: Maneja clicks del jugador en el tablero enemigo
- **PlayerShotsGrid**: Muestra disparos del jugador
- **EnemyShotsGrid**: Muestra disparos del enemigo

### 4. Sistema de Cámara

#### Eventos de Cámara:
- `CAMERA_SHOOT_START`: Transición a vista de disparo
- `CAMERA_SHOOT_END`: Transición a vista normal
- `CAMERA_TOGGLE_PLAYER_PERSPECTIVE`: Cambio de perspectiva

#### Posiciones de Cámara:
- **Vista Normal**: Posición elevada para visión general
- **Vista de Disparo**: Posición cercana al tablero enemigo
- **Animaciones**: Transiciones suaves entre posiciones

### 5. Efectos Visuales

#### WaterExplosion
- Efectos de partículas para impactos en agua
- Animaciones de ondas expansivas
- Gestión de ciclo de vida de efectos

#### Droplet
- Efectos de gotas de agua
- Cálculos de física para movimiento
- Integración con el sistema de partículas

### 6. Sistema de Eventos

#### EventBus
Sistema de comunicación entre componentes:
- Suscripción a eventos (`on`)
- Emisión de eventos (`emit`)
- Desuscripción de eventos (`off`)

#### Eventos Principales:
- Eventos de cámara para transiciones
- Eventos de disparo para sincronización
- Eventos de fin de juego

### 7. Lógica de IA del Enemigo

#### Comportamiento:
- Disparos aleatorios en celdas no visitadas
- Turnos automáticos después del disparo del jugador
- No hay estrategia avanzada implementada

### 8. Interfaz de Usuario

#### Controles:
- **Click**: Disparar en celdas del tablero enemigo
- **P**: Alternar panel de debug
- **Perspectiva**: Cambio automático de cámara

#### Elementos UI:
- **GameOverModal**: Modal de fin de juego con opción de reinicio
- **DebugPanel**: Información de debug del juego
- **PerformanceMonitor**: Monitoreo de rendimiento

### 9. Sistema de Coordenadas

#### Conversiones:
- **World to Grid**: Conversión de coordenadas 3D a coordenadas de cuadrícula
- **Grid to World**: Conversión de coordenadas de cuadrícula a 3D
- **Validación**: Verificación de posiciones válidas

### 10. Optimización y Rendimiento

#### Técnicas Implementadas:
- Uso de `useRef` para referencias estables
- Memoización de cálculos costosos
- Gestión eficiente del ciclo de vida de componentes
- Monitoreo de rendimiento con stats.js

#### Gestión de Memoria:
- Limpieza automática de efectos visuales
- Desuscripción de eventos en cleanup
- Reutilización de objetos 3D

## Flujo de Juego de Armada.io

### 1. Inicialización
1. Generación aleatoria de barcos para jugador y enemigo
2. Selección aleatoria del primer turno
3. Configuración inicial de la cámara

### 2. Turno del Jugador
1. Cámara se posiciona sobre el tablero enemigo
2. Jugador hace click en una celda
3. Sistema verifica si es un impacto
4. Se registra el disparo
5. Se muestran efectos visuales
6. Turno pasa al enemigo

### 3. Turno del Enemigo
1. Cámara se posiciona sobre el tablero del jugador
2. IA realiza disparo aleatorio
3. Sistema verifica impacto
4. Se registra el disparo
5. Turno pasa al jugador

### 4. Condiciones de Victoria
- **Jugador Gana**: Todos los barcos enemigos destruidos
- **Enemigo Gana**: Todos los barcos del jugador destruidos

### 5. Fin de Juego
1. Modal de victoria/derrota
2. Opción de reiniciar juego
3. Reinicialización completa del estado

## Estructura de Archivos

```
src/
├── components/          # Componentes React
│   ├── GameGrid/       # Tablero principal
│   ├── PressGrid/      # Interacción de disparos
│   ├── ShipsPlane/     # Renderizado de barcos
│   ├── WaterExplosion/ # Efectos de impacto
│   └── ...
├── game/logic/         # Lógica del juego
    │   ├── armada.ts   # Clase principal del juego
│   ├── shipGenerator.ts # Generación de barcos
│   └── ...
├── stores/             # Estado global
│   └── gameStore.ts    # Store principal
├── hooks/              # Hooks personalizados
├── utils/              # Utilidades
└── env/                # Configuración del entorno 3D
```

## Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build

# Testing
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura

# Linting
npm run lint             # Verificar código

# Simulación
npm run run:deterministic # Ejecutar simulación determinística
```

## Consideraciones Técnicas

### Rendimiento
- Uso de `useFrame` para animaciones eficientes
- Gestión cuidadosa de objetos 3D
- Optimización de re-renders con React

### Compatibilidad
- Soporte para dispositivos móviles
- Detección automática de capacidades del dispositivo
- Ajustes de cámara según el dispositivo

### Escalabilidad
- Arquitectura modular para fácil extensión
- Sistema de eventos desacoplado
- Estado centralizado para gestión consistente

## Posibles Mejoras para Armada.io

1. **IA Avanzada**: Implementar estrategias más inteligentes para el enemigo
2. **Multiplayer**: Soporte para juego en red
3. **Diferentes Modos**: Variaciones del juego (tiempo limitado, etc.)
4. **Efectos de Sonido**: Integración de audio
5. **Animaciones Avanzadas**: Más efectos visuales
6. **Persistencia**: Guardado de partidas
7. **Estadísticas**: Seguimiento de rendimiento del jugador 