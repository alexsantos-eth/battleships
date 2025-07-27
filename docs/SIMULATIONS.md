# 🎮 Simulaciones de Armada.io

Esta carpeta contiene las simulaciones y ejemplos de batalla que se utilizan para testing y debugging del juego.

## 📁 Archivos

### `mockBattleSimulation.ts`
Simulaciones de batalla predefinidas para testing y debugging:

- **`createMockBattleWithPlayerWin()`** - Simulación donde gana el jugador
- **`createMockBattleWithEnemyWin()`** - Simulación donde gana el enemigo
- **`createRandomBattleSimulation()`** - Simulación aleatoria con límite de tiros
- **`createQuickMockBattle()`** - Simulación rápida para testing
- **`runMockSimulation()`** - Función principal que ejecuta simulaciones según el tipo

### `index.ts`
Archivo de exportación centralizada para facilitar las importaciones.

## 🎯 Uso

Las simulaciones se utilizan principalmente en:

- **Debug Panel**: Para probar diferentes escenarios de juego
- **Testing**: Para validar la lógica del juego
- **Development**: Para simular partidas completas rápidamente

## 🔧 Tipos de Simulación

```typescript
type SimulationType = 'player-win' | 'enemy-win' | 'quick' | 'random';
```

- **`player-win`**: Simulación donde el jugador gana
- **`enemy-win`**: Simulación donde el enemigo gana  
- **`quick`**: Simulación rápida para testing
- **`random`**: Simulación aleatoria con parámetros configurables

## 📊 Resultado de Simulación

```typescript
interface MockBattleResult {
  winner: "player" | "enemy";
  totalTurns: number;
  playerShots: number;
  enemyShots: number;
  playerHits: number;
  enemyHits: number;
  shipPlacements: { player: ShipPlacement[]; enemy: ShipPlacement[] };
  shotHistory: ShotRecord[];
}
```

## 🚀 Ejemplo de Uso

```typescript
import { runMockSimulation } from '@/simulations';

// Ejecutar simulación rápida
const result = runMockSimulation('quick');

// Ejecutar simulación aleatoria
const randomResult = runMockSimulation('random');
```

---

**Nota**: Estas simulaciones están separadas del código principal del juego para mantener la limpieza del código y facilitar el testing. 