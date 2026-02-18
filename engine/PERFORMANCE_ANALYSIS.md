# 🔍 Análisis de Optimización del Core Engine

## Resumen Ejecutivo

El core actual **NO está optimizado** para miles de simulaciones. Para simulaciones masivas, se identificaron múltiples cuellos de botella que impactan significativamente el rendimiento.

## 🚨 Problemas Críticos Identificados

### 1. **Búsquedas Lineales O(n) - CRÍTICO**

#### `isCellShot()` - [logic.ts](src/core/engine/logic.ts#L229-L232)
```typescript
public isCellShot(x: number, y: number, isPlayerShot: boolean): boolean {
  const shots = isPlayerShot ? this.playerShots : this.enemyShots;
  return shots.some((shot) => shot.x === x && shot.y === y);  // ❌ O(n)
}
```
**Impacto**: Se llama en cada disparo → O(n²) acumulativo
**Solución**: Usar `Set<string>` para búsqueda O(1)

#### `checkShot()` - [logic.ts](src/core/engine/logic.ts#L202-L218)
```typescript
public checkShot(x: number, y: number, isPlayerShot: boolean): { hit: boolean; shipId: number } {
  const ships = isPlayerShot ? this.enemyShips : this.playerShips;
  
  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i];
    const shipCells = getShipCellsFromShip(ship);  // ❌ Recalcula cada vez
    
    for (const [cellX, cellY] of shipCells) {      // ❌ O(ships × cells)
      if (cellX === x && cellY === y) {
        return { hit: true, shipId: i };
      }
    }
  }
  return { hit: false, shipId: -1 };
}
```
**Impacto**: En promedio ~10 iteraciones por disparo + recálculo de celdas
**Solución**: Usar `Map<string, shipId>` precalculado

#### `hasShipAtPosition()` - [logic.ts](src/core/engine/logic.ts#L477-L490)
```typescript
public hasShipAtPosition(x: number, y: number, isPlayerShips: boolean): boolean {
  const ships = isPlayerShips ? this.playerShips : this.enemyShips;
  
  for (const ship of ships) {
    const shipCells = getShipCellsFromShip(ship);  // ❌ Recalcula repetidamente
    for (const [cellX, cellY] of shipCells) {
      if (cellX === x && cellY === y) {
        return true;
      }
    }
  }
  return false;
}
```

### 2. **Copias Innecesarias de Arrays - CRÍTICO**

#### `getState()` - [logic.ts](src/core/engine/logic.ts#L334-L349)
```typescript
public getState(): GameEngineState {
  return {
    currentTurn: this.currentTurn,
    isPlayerTurn: this.isPlayerTurn(),
    isEnemyTurn: this.isEnemyTurn(),
    playerShips: [...this.playerShips],      // ❌ Copia completa
    enemyShips: [...this.enemyShips],        // ❌ Copia completa
    playerShots: [...this.playerShots],      // ❌ Copia completa
    enemyShots: [...this.enemyShots],        // ❌ Copia completa
    isGameOver: this.isGameOver,
    winner: this.winner,
    boardWidth: this.boardWidth,
    boardHeight: this.boardHeight,
    shotCount: this.shotCount,
  };
}
```
**Impacto**: Se llama en cada `notifyStateChange()` → Copia arrays constantemente
**Solución**: Devolver referencias directas para simulaciones, copias solo si es necesario

#### Múltiples getters con copias - [logic.ts](src/core/engine/logic.ts#L354-L381)
```typescript
public getPlayerShips(): GameShip[] {
  return [...this.playerShips];  // ❌ Copia siempre
}

public getEnemyShips(): GameShip[] {
  return [...this.enemyShips];   // ❌ Copia siempre
}

public getPlayerShots(): Shot[] {
  return [...this.playerShots];  // ❌ Copia siempre
}

public getEnemyShots(): Shot[] {
  return [...this.enemyShots];   // ❌ Copia siempre
}
```

### 3. **Callbacks en Simulaciones - MEDIO**

#### `notifyStateChange()` - [logic.ts](src/core/engine/logic.ts#L495-L497)
```typescript
private notifyStateChange(): void {
  this.onStateChange?.(this.getState());  // ❌ Llama getState() que hace copias
}
```
**Impacto**: Se llama ~10 veces por disparo (setBoardDimensions, resetGame, executeShot, etc.)
**Solución**: Modo "silent" para simulaciones sin callbacks

### 4. **Recálculo Constante de Celdas de Barcos - CRÍTICO**

`getShipCellsFromShip()` se llama repetidamente:
- En cada `checkShot()`
- En cada `hasShipAtPosition()`
- En cada `isShipDestroyed()`

**Solución**: Cachear las celdas al inicializar el juego

### 5. **AI Player Ineficiente - MEDIO**

#### `updateAvailablePositions()` - [automata.ts](src/core/simulations/automata.ts#L24-L35)
```typescript
private updateAvailablePositions(): void {
  const { width, height } = this.engine.getBoardDimensions();
  this.availablePositions = [];  // ❌ Reconstruye array completo
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!this.engine.isCellShot(x, y, this.isPlayer)) {  // ❌ O(n) cada vez
        this.availablePositions.push([x, y]);
      }
    }
  }
}
```
**Impacto**: Reconstruye el array completo en cada disparo → O(width × height × shots)
**Solución**: Actualizar incrementalmente removiendo la posición disparada

## 📊 Estimación de Impacto

Para un juego típico de 5×5 con ~15 disparos promedio:

| Operación | Actual | Optimizado | Mejora |
|-----------|--------|------------|--------|
| checkShot() | O(n) × ships | O(1) | ~50x |
| isCellShot() | O(shots) | O(1) | ~15x |
| hasShipAtPosition() | O(ships × cells) | O(1) | ~30x |
| getState() copias | 4 arrays × ~10 calls | 0 copias | ~100x |
| AI updatePositions() | O(board) × shots | O(1) | ~15x |

**Estimación conservadora**: **10-20x más rápido** para simulaciones masivas

## 🎯 Prioridades de Optimización

### P0 - CRÍTICO (Implementar primero)
1. ✅ Usar `Set<string>` para shots disparados
2. ✅ Usar `Map<string, shipId>` para posiciones de barcos
3. ✅ Cachear celdas de barcos al inicializar
4. ✅ Modo "silent" sin callbacks ni copias

### P1 - IMPORTANTE
5. ✅ Optimizar AI Player con actualización incremental
6. ✅ Lazy evaluation en getState()

### P2 - MEJORAS
7. Object pooling para estructuras reutilizables
8. Packed bit arrays para representar tablero

## 🔧 Soluciones Recomendadas

### Opción A: **Clase Optimizada Separada** ⭐ RECOMENDADO
Crear `FastGameEngine` para simulaciones:
- Sin callbacks
- Estructuras de datos optimizadas (Maps/Sets)
- Sin copias defensivas
- API compatible

**Ventajas**: No rompe código existente, máximo rendimiento  
**Desventajas**: Duplicación de código

### Opción B: **Flags de Optimización**
Agregar flag `simulationMode: boolean` al constructor:
```typescript
constructor(config: Partial<GameConfig> = {}, callbacks?: GameEngineCallbacks, simulationMode = false)
```

**Ventajas**: Un solo código  
**Desventajas**: Más complejo, branches en hot paths

### Opción C: **Refactorización Completa**
Optimizar todo el código base actual:

**Ventajas**: Todos se benefician  
**Desventajas**: Cambios breaking, más riesgo

## 💡 Recomendación Final

**Implementar Opción A**: `FastGameEngine` dedicado para simulaciones

1. Mantener `GameEngine` actual para UI (con copias defensivas y callbacks)
2. Crear `FastGameEngine` optimizado para simulaciones masivas
3. Compartir interfaces y tipos
4. API compatible para fácil intercambio

**Siguiente paso**: ¿Quieres que implemente `FastGameEngine` optimizado?
