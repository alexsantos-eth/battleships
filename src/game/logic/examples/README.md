# 🎯 Simulaciones Mock y Visuales

Este directorio contiene las simulaciones deterministas que **SÍ terminan con un ganador** y se pueden ejecutar tanto en consola como visualmente en la UI.

## 🚀 Funcionalidades

### 1. **Simulaciones Mock (Consola)**
- **⚡ Rápida**: 1 barco vs 1 barco, termina en 2 turnos
- **👤 Jugador Gana**: Configuración específica donde el jugador destruye todos los barcos enemigos
- **🤖 Enemigo Gana**: Configuración específica donde el enemigo destruye todos los barcos del jugador

### 2. **Simulaciones Visuales (UI)**
- **🎬 Visual Rápida**: Muestra los disparos en tiempo real en el tablero
- **🎬 Visual Jugador Gana**: Simulación visual donde el jugador gana
- **🎬 Visual Enemigo Gana**: Simulación visual donde el enemigo gana

## 📊 Características

### ✅ **Deterministas**
- Mismos resultados con mismos seeds
- Comportamiento predecible y reproducible

### ✅ **Con Ganador Garantizado**
- Todas las simulaciones terminan con un ganador
- No más `Ganador=null`

### ✅ **Visuales**
- Los disparos se muestran en el tablero 3D
- Animaciones de explosiones de agua
- Progreso en tiempo real

### ✅ **Rápidas**
- Simulaciones que terminan en segundos
- Delay configurable entre disparos (800ms por defecto)

## 🎮 Cómo Usar

### En la UI de Debug:
1. **Abre el panel de debug** en la aplicación
2. **Sección "Simulaciones Mock"**: Para resultados en consola
3. **Sección "Simulación Visual"**: Para ver los disparos en el tablero
4. **Haz clic en cualquier botón** para ejecutar la simulación
5. **Observa los resultados** en tiempo real

### En Consola:
```bash
# Compilar
npx tsc --project tsconfig.script.json

# Ejecutar simulación rápida
node dist/examples/testMockSimulation.js

# Ejecutar simulación visual
node dist/examples/testVisualSimulation.js
```

## 🔧 Configuración

### Delay entre disparos:
```typescript
// En useVisualMockSimulation.ts
await simulateShot(shot, 800); // 800ms entre disparos
```

### Tipos de simulación:
```typescript
type SimulationType = 'quick' | 'player-win' | 'enemy-win';
```

## 📈 Resultados Esperados

### ⚡ Simulación Rápida:
- **Ganador**: Player
- **Turnos**: 2
- **Disparos**: 2

### 👤 Jugador Gana:
- **Ganador**: Player
- **Turnos**: 10
- **Disparos**: 10

### 🤖 Enemigo Gana:
- **Ganador**: Enemy
- **Turnos**: 5
- **Disparos**: 5

## 🎯 Ventajas

1. **Testing**: Perfecto para probar la lógica del juego
2. **Demo**: Ideal para demostraciones
3. **Debug**: Ayuda a identificar problemas
4. **Determinismo**: Resultados consistentes
5. **Visualización**: Entendimiento claro del flujo del juego

## 🔄 Flujo de Simulación Visual

1. **Configuración**: Los barcos se colocan según la simulación mock
2. **Inicialización**: El juego se inicializa con el estado mock
3. **Simulación**: Cada disparo se ejecuta con delay visual
4. **Visualización**: Los disparos aparecen en el tablero 3D
5. **Resultado**: Se muestra el ganador y estadísticas

## 🛠️ Archivos Principales

- `mockBattleSimulation.ts`: Lógica de las simulaciones mock
- `useVisualMockSimulation.ts`: Hook para simulación visual
- `DebugInfoContent.tsx`: UI para ejecutar simulaciones
- `testMockSimulation.ts`: Pruebas de simulaciones mock
- `testVisualSimulation.ts`: Pruebas de simulaciones visuales 