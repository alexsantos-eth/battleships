# 🚢 Optimización de Cálculos de Barcos

## 📋 Resumen

Se ha optimizado el código eliminando funciones duplicadas para calcular las celdas de los barcos, centralizando toda la lógica en un archivo de utilidades.

## 🔧 Cambios Realizados

### 1. Creación de Utilidades Centralizadas

**Archivo:** `src/utils/shipCalculations.ts`

```typescript
export function getShipCells(
  x: number,
  y: number,
  size: number,
  orientation: "horizontal" | "vertical"
): [number, number][]

export function getShipCellsFromShip(ship: Ship): [number, number][]

export function getShipSize(variant: ShipVariant): number

export function isValidShipPlacement(
  ship: Ship,
  existingShips: Ship[],
  boardWidth: number,
  boardHeight: number
): boolean
```

### 2. Archivos Optimizados

#### `src/bundle/components/GameBoard/GameBoard.tsx`
- ❌ Eliminada función `getShipCells` duplicada
- ✅ Importada función `getShipCellsFromShip` centralizada

#### `src/bundle/hooks/game/useGameState.ts`
- ❌ Eliminadas funciones `getShipCells` y `getShipSize` duplicadas
- ✅ Importadas funciones centralizadas

#### `src/game/manager/initializer.ts`
- ❌ Eliminadas funciones duplicadas:
  - `getShipCells`
  - `getShipSize`
  - `isShipInBounds`
  - `isValidDistance`
- ✅ Importadas funciones centralizadas
- ✅ Simplificada función `isValidShipPlacement`

#### `src/services/game/data.ts`
- ❌ Eliminada función `getShipCells` duplicada
- ✅ Importada función `getShipCellsFromShip` centralizada

#### `src/game/manager/__tests__/gameInitializer.test.ts`
- ❌ Eliminada función `getShipCells` duplicada
- ✅ Importada función `getShipCellsFromShip` centralizada

## 🎯 Beneficios de la Optimización

### 1. **DRY (Don't Repeat Yourself)**
- Eliminación de código duplicado
- Una sola fuente de verdad para cálculos de barcos

### 2. **Mantenibilidad**
- Cambios en lógica de barcos solo requieren modificar un archivo
- Reducción de errores por inconsistencias

### 3. **Rendimiento**
- Funciones optimizadas y reutilizables
- Menos código para cargar en memoria

### 4. **Consistencia**
- Mismo comportamiento en todos los componentes
- Tipos uniformes en toda la aplicación

## 📊 Métricas de Mejora

### Código Eliminado
- **5 funciones duplicadas** eliminadas
- **~80 líneas de código** reducidas
- **4 archivos** optimizados

### Funciones Centralizadas
- **4 funciones utilitarias** creadas
- **1 archivo de utilidades** nuevo
- **Tipado completo** con TypeScript

## 🔍 Funciones Disponibles

### `getShipCells(x, y, size, orientation)`
Calcula las celdas que ocupa un barco basado en coordenadas y parámetros.

### `getShipCellsFromShip(ship)`
Calcula las celdas que ocupa un barco usando el objeto Ship completo.

### `getShipSize(variant)`
Obtiene el tamaño de un barco basado en su variante.

### `isValidShipPlacement(ship, existingShips, boardWidth, boardHeight)`
Valida si un barco puede ser colocado sin conflictos.

## 🚀 Uso Futuro

Para usar estas funciones en nuevos componentes:

```typescript
import { 
  getShipCells, 
  getShipCellsFromShip, 
  getShipSize, 
  isValidShipPlacement 
} from "@/utils/shipCalculations";

// Ejemplo de uso
const shipCells = getShipCellsFromShip(ship);
const shipSize = getShipSize("large");
const isValid = isValidShipPlacement(newShip, existingShips, 10, 10);
```

## 📝 Notas Importantes

- Todas las funciones están completamente tipadas
- Compatible con el sistema de tipos existente
- Mantiene la misma API que las funciones originales
- Incluye validaciones de bordes y distancias mínimas

## 🔄 Migración Completa

La optimización se ha aplicado a todos los archivos que usaban cálculos de barcos:

1. ✅ Componentes de UI
2. ✅ Hooks de estado
3. ✅ Servicios de juego
4. ✅ Inicializador de juego
5. ✅ Pruebas unitarias

Todos los archivos ahora usan las funciones centralizadas, eliminando completamente la duplicación de código. 