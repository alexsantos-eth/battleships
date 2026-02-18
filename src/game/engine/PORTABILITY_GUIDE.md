# 📦 Guía de Portabilidad - Motor de Juego

**Cómo mover esta librería a un nuevo proyecto JavaScript o publicarla como paquete npm.**

## 🎯 Resumen

El motor del juego (`GameEngine + AIPlayer`) es **100% portable** y funciona en cualquier entorno JavaScript/TypeScript:
- ✅ Node.js (servidor)
- ✅ Navegador (cliente)
- ✅ React Native
- ✅ Electron
- ✅ Bun/Deno

**Cero dependencias externas (npm).** Solo usa TypeScript/JavaScript puro.

---

## 📁 Archivos de la Librería

### 1. Core del Engine (imprescindibles)

```
src/game/engine/
├── GameEngine.ts           # Motor principal
├── AIPlayer.ts             # Lógica de IA
├── index.ts                # Exportaciones
├── README.md               # Documentación
└── QUICK_START.md          # Guía rápida
```

### 2. Utilidades del Juego (requeridas)

```
src/tools/ship/
└── calculations.ts         # Funciones de cálculo de barcos
```

### 3. Tipos TypeScript (requeridos)

```
src/types/game/
├── common.ts               # Tipos principales (GameShip, Shot, etc.)
└── config.ts               # Configuración del juego
```

### 4. Constantes (parcialmente requerido)

```
src/constants/game/
└── board.ts                # Solo necesitas GAME_CONSTANTS.SHIPS.SIZES
```

### 5. Ejemplos (opcionales, pero recomendados)

```
src/game/engine/
└── examples.ts             # 6 ejemplos de uso
```

---

## 🔧 Opción 1: Mover a Nuevo Proyecto (Estructura Completa)

### Paso 1: Crear estructura del proyecto

```bash
mkdir battleship-engine && cd battleship-engine
npm init -y
npm install -D typescript @types/node
npx tsc --init
```

### Paso 2: Copiar archivos manteniendo estructura

```
battleship-engine/
├── package.json
├── tsconfig.json
└── src/
    ├── engine/
    │   ├── GameEngine.ts
    │   ├── AIPlayer.ts
    │   ├── index.ts
    │   ├── examples.ts
    │   ├── README.md
    │   └── QUICK_START.md
    ├── tools/
    │   └── ship/
    │       └── calculations.ts
    ├── types/
    │   ├── common.ts
    │   └── config.ts
    └── constants/
        └── game.ts
```

### Paso 3: Ajustar imports

Cambiar imports de alias `@/` a rutas relativas:

**GameEngine.ts**
```typescript
// Antes
import { getShipCellsFromShip } from "@/tools/ship/calculations";
import type { GameShip, Shot, Winner, GameTurn } from "@/types/game/common";
import type { GameConfig } from "@/types/game/config";

// Después
import { getShipCellsFromShip } from "../../tools/ship/calculations";
import type { GameShip, Shot, Winner, GameTurn } from "../../types/common";
import type { GameConfig } from "../../types/config";
```

**AIPlayer.ts**
```typescript
// Antes
import type { GameEngine } from "./GameEngine";

// Después (sin cambios)
import type { GameEngine } from "./GameEngine";
```

**calculations.ts**
```typescript
// Antes
import { GAME_CONSTANTS } from "@/constants/game/board";
import type { ShipVariant, GameShip } from "@/types/game/common";
import type { GameConfig } from "@/types/game/config";

// Después
import { GAME_CONSTANTS } from "../../constants/game";
import type { ShipVariant, GameShip } from "../../types/common";
import type { GameConfig } from "../../types/config";
```

**examples.ts**
```typescript
// Antes
import { GameEngine, AIPlayer, SmartAIPlayer } from '@/game/engine';
import { generateShips } from '@/tools/ship/calculations';
import type { GameConfig } from '@/types/game/config';

// Después
import { GameEngine, AIPlayer, SmartAIPlayer } from './index';
import { generateShips } from '../../tools/ship/calculations';
import type { GameConfig } from '../../types/config';
```

### Paso 4: Simplificar constants/game.ts

Crear un archivo mínimo con solo lo necesario:

```typescript
// constants/game.ts
export const GAME_CONSTANTS = {
  SHIPS: {
    SIZES: {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    } as const,
    DEFAULT_COUNTS: {
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 1,
    } as const,
    MIN_DISTANCE: 2,
    MAX_PLACEMENT_ATTEMPTS: 200,
    MAX_GENERATION_ATTEMPTS: 1000,
  },
};
```

### Paso 5: Configurar tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Paso 6: Actualizar package.json

```json
{
  "name": "battleship-engine",
  "version": "1.0.0",
  "description": "Pure JavaScript/TypeScript battleship game engine",
  "main": "dist/engine/index.js",
  "types": "dist/engine/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "node dist/engine/examples.js"
  },
  "keywords": ["battleship", "game-engine", "typescript", "game-logic"],
  "author": "Tu Nombre",
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### Paso 7: Compilar y probar

```bash
npm run build
npm test
```

---

## 🚀 Opción 2: Archivo Standalone Único (Todo en uno)

Si prefieres un **solo archivo** portable sin dependencias:

Ver: [standalone.ts](./standalone.ts) (se crearía opcionalmente)

Este archivo contiene:
- Todos los tipos
- Todas las constantes
- Cálculos de barcos
- GameEngine
- AIPlayer
- Ejemplos

**Uso standalone:**
```typescript
// Copiar standalone.ts a tu proyecto
import { GameEngine, AIPlayer, generateShips } from './standalone';

const engine = new GameEngine();
// ... usar normalmente
```

---

## 📦 Opción 3: Publicar como paquete npm

### Paso 1: Preparar el paquete

Usar la estructura de la **Opción 1**, luego:

```bash
# Crear cuenta en npmjs.com si no tienes
npm login

# Compilar
npm run build

# Publicar
npm publish
```

### Paso 2: README.md para npm

Crear un `README.md` en la raíz con:
- Instalación: `npm install battleship-engine`
- Ejemplos básicos
- API reference
- Links a documentación completa

### Paso 3: Usar desde cualquier proyecto

```bash
npm install battleship-engine
```

```typescript
import { GameEngine, AIPlayer } from 'battleship-engine';
import { generateShips } from 'battleship-engine/tools/ship';

const engine = new GameEngine();
const ships = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(ships, ships, 'PLAYER_TURN');
```

---

## 🔍 Dependencias Detalladas

### Dependencias del GameEngine:

```typescript
// GameEngine.ts depende de:
import { getShipCellsFromShip } from "@/tools/ship/calculations"; // ✅ Incluir
import type { GameShip, Shot, Winner, GameTurn } from "@/types/game/common"; // ✅ Incluir
import type { GameConfig } from "@/types/game/config"; // ✅ Incluir
```

### Dependencias de calculations.ts:

```typescript
// calculations.ts depende de:
import { GAME_CONSTANTS } from "@/constants/game/board"; // ✅ Solo SHIPS.SIZES
import type { ShipVariant, GameShip } from "@/types/game/common"; // ✅ Ya incluido
import type { GameConfig } from "@/types/game/config"; // ✅ Ya incluido
```

### Dependencias de AIPlayer:

```typescript
// AIPlayer.ts depende de:
import type { GameEngine } from "./GameEngine"; // ✅ Ya incluido
```

**Total: CERO dependencias npm externas** 🎉

---

## ✅ Checklist de Portabilidad

- [ ] Copiar directorio `src/game/engine/`
- [ ] Copiar `src/tools/ship/calculations.ts`
- [ ] Copiar `src/types/game/common.ts`
- [ ] Copiar `src/types/game/config.ts`
- [ ] Extraer `GAME_CONSTANTS.SHIPS` de `src/constants/game/board.ts`
- [ ] Ajustar imports (de `@/` a rutas relativas)
- [ ] Configurar tsconfig.json
- [ ] Compilar con TypeScript
- [ ] Probar con examples.ts
- [ ] (Opcional) Publicar a npm

---

## 🧪 Verificación Post-Migración

### Prueba rápida:

```typescript
import { GameEngine, AIPlayer } from './src/engine';
import { generateShips } from './src/tools/ship/calculations';

console.log('Testing GameEngine portability...');

const engine = new GameEngine();
const ships = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(ships, ships, 'PLAYER_TURN');

const ai = new AIPlayer(engine);
const result = ai.executeTurn();

console.log('✅ Engine works!', result);
```

---

## 📊 Tamaño de la Librería

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| GameEngine.ts | ~430 | Motor principal |
| AIPlayer.ts | ~200 | Lógica de IA |
| calculations.ts | ~230 | Utilidades de barcos |
| common.ts | ~60 | Tipos TypeScript |
| config.ts | ~15 | Configuración |
| constants | ~30 | Solo SHIPS.SIZES |
| **TOTAL** | **~965** | **Sin dependencias** |

**Tamaño compilado:** ~50-80KB (minificado: ~20-30KB)

---

## 🌐 Compatibilidad

| Entorno | Compatible | Notas |
|---------|------------|-------|
| Node.js 16+ | ✅ | Usar con `"type": "module"` en package.json |
| Navegadores modernos | ✅ | ES2020+ |
| React | ✅ | Importar normalmente |
| Vue | ✅ | Importar normalmente |
| Angular | ✅ | Importar normalmente |
| Svelte | ✅ | Importar normalmente |
| React Native | ✅ | Sin dependencias de DOM |
| Electron | ✅ | Funciona en renderer y main |
| Bun | ✅ | Compatible TypeScript nativo |
| Deno | ✅ | Ajustar imports a .ts |

---

## 💡 Casos de Uso

Con esta librería portable puedes:

1. **Servidor Node.js:** Lógica de juego multiplayer
2. **Cliente Web:** UI con React/Vue/Angular
3. **Mobile:** React Native app
4. **Desktop:** Electron app
5. **Bot de Discord:** Juego por comandos
6. **Testing:** Simulaciones masivas
7. **IA Training:** Entrenar modelos con partidas
8. **CLI Game:** Juego de consola
9. **WebAssembly:** Compilar para máximo rendimiento
10. **Worker Threads:** Simulaciones paralelas

---

## 🆘 Solución de Problemas

### Error: "Cannot find module '@/...'"

**Causa:** Imports con alias no resueltos.

**Solución:** Cambiar a rutas relativas (ver Paso 3).

### Error: "GAME_CONSTANTS is not defined"

**Causa:** Archivo de constantes no copiado.

**Solución:** Copiar/crear `constants/game.ts` con SHIPS.SIZES.

### Error: "generateShips is not a function"

**Causa:** Archivo calculations.ts no copiado o mal imported.

**Solución:** Verificar que `tools/ship/calculations.ts` esté incluido.

### TypeScript errors en tipos

**Causa:** Archivos de tipos no copiados.

**Solución:** Copiar `types/common.ts` y `types/config.ts`.

---

## 📞 Soporte

- Documentación completa: [README.md](./README.md)
- Guía rápida: [QUICK_START.md](./QUICK_START.md)
- Ejemplos: [examples.ts](./examples.ts)

---

## 🎉 Resumen

**La librería es 100% portable con estos pasos:**

1. Copiar 6 archivos esenciales
2. Ajustar imports (búsqueda/reemplazo de `@/`)
3. Compilar con TypeScript
4. ¡Listo para usar!

**Sin dependencias npm, sin configuración compleja, solo código puro.**

---

*Última actualización: Febrero 2026*
