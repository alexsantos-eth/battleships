# ✅ Checklist de Migración - Motor de Juego

## 🎯 Opciones para Mover la Librería

Elige una de estas 3 opciones según tus necesidades:

### Opción 1: Script Automático (⚡ Recomendado)

```bash
# Migrar a un nuevo proyecto
node src/game/engine/migrate-engine.js /path/to/new/project

# Para publicar en npm
node src/game/engine/migrate-engine.js /path/to/new/project --npm
```

**✅ Ventajas:**
- Automático y rápido
- Transforma imports automáticamente
- Crea estructura completa
- Configura TypeScript y npm

---

### Opción 2: Archivo Standalone (📄 Más Simple)

```bash
# Copiar un solo archivo
cp src/game/engine/standalone.ts /path/to/new/project/
```

**✅ Ventajas:**
- Un solo archivo
- Sin dependencias
- Copia y pega
- Listo para usar

**Uso:**
```typescript
import { GameEngine, AIPlayer, generateShips } from './standalone';
```

---

### Opción 3: Manual (🔧 Máximo Control)

Ver guía completa: [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md)

**Pasos:**
1. ✅ Copiar archivos del engine
2. ✅ Copiar archivos de utilidades
3. ✅ Copiar tipos TypeScript
4. ✅ Copiar constantes
5. ✅ Cambiar imports (`@/` → rutas relativas)
6. ✅ Compilar y probar

---

## 📦 Archivos de la Librería

### Core (Imprescindibles)
```
src/game/engine/
├── GameEngine.ts           ← Motor principal
├── AIPlayer.ts             ← IA del jugador
└── index.ts                ← Exportaciones
```

### Dependencias (Requeridas)
```
src/tools/ship/
└── calculations.ts         ← Cálculos de barcos

src/types/
├── common.ts               ← Tipos (GameShip, Shot, etc.)
└── config.ts               ← Configuración

src/constants/game/
└── board.ts                ← Solo GAME_CONSTANTS.SHIPS
```

### Documentación (Opcional, recomendada)
```
src/game/engine/
├── README.md               ← Documentación completa
├── QUICK_START.md          ← Inicio rápido
├── PORTABILITY_GUIDE.md    ← Esta guía
└── examples.ts             ← 6 ejemplos
```

---

## 🔍 Verificación Post-Migración

### Test Rápido

```typescript
import { GameEngine, AIPlayer } from './src/engine';
import { generateShips } from './src/tools/ship/calculations';

const engine = new GameEngine();
const ships = generateShips({ boardWidth: 10, boardHeight: 10 });
engine.initializeGame(ships, ships, 'PLAYER_TURN');

const ai = new AIPlayer(engine);
const result = ai.executeTurn();

console.log(result?.hit ? '✅ Works!' : '✅ Works!');
```

### Compilación

```bash
# TypeScript
npx tsc

# Debería compilar sin errores
```

---

## 🚀 Próximos Pasos

### Para Desarrollo Local

```bash
cd /path/to/new/project
npm install
npm run dev
```

### Para Publicar en npm

```bash
# 1. Actualizar package.json
#    - name: tu-paquete
#    - version: 1.0.0
#    - author: Tu Nombre

# 2. Compilar
npm run build

# 3. Publicar
npm login
npm publish
```

### Para Usar en Otro Proyecto

```bash
npm install tu-paquete
```

```typescript
import { GameEngine, AIPlayer } from 'tu-paquete';
```

---

## 🎮 Guías de Referencia Rápida

| Documento | Para qué sirve |
|-----------|----------------|
| [README.md](./README.md) | API completa, ejemplos, documentación |
| [QUICK_START.md](./QUICK_START.md) | Inicio rápido, ejemplos básicos |
| [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) | Guía completa de migración |
| [standalone.ts](./standalone.ts) | Versión todo-en-uno |
| [migrate-engine.js](./migrate-engine.js) | Script de migración |
| [examples.ts](./examples.ts) | 6 ejemplos ejecutables |

---

## ⚙️ Configuración Mínima

### package.json

```json
{
  "name": "battleship-engine",
  "version": "1.0.0",
  "main": "dist/engine/index.js",
  "types": "dist/engine/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 📊 Resumen

| Método | Tiempo | Dificultad | Flexibilidad |
|--------|--------|------------|--------------|
| Script automático | 1 min | ⭐ Fácil | Media |
| Standalone | 30 seg | ⭐ Muy fácil | Baja |
| Manual | 10 min | ⭐⭐ Media | Alta |

---

## 🆘 Solución de Problemas

### "Cannot find module '@/...'"

```bash
# Cambiar imports con búsqueda/reemplazo
# De: from "@/game/engine"
# A:  from "./index"
```

### "GAME_CONSTANTS is not defined"

```bash
# Crear archivo constants/game.ts
# Ver: PORTABILITY_GUIDE.md sección "Paso 4"
```

### Errores de TypeScript

```bash
# Verificar que todos los archivos de tipos estén copiados
# types/common.ts
# types/config.ts
```

---

## 💡 Tips

- ✅ Usa el **script automático** para proyectos nuevos
- ✅ Usa **standalone.ts** para experimentos rápidos
- ✅ Usa **manual** cuando necesites personalización
- ✅ Lee **PORTABILITY_GUIDE.md** para detalles completos
- ✅ Prueba con **examples.ts** después de migrar

---

## 🎉 ¡Listo!

Una vez migrada, la librería funciona en:
- ✅ Node.js
- ✅ Navegadores
- ✅ React Native
- ✅ Electron
- ✅ Bun/Deno
- ✅ **Cualquier entorno JavaScript**

**Sin dependencias externas. Solo TypeScript puro.** 🚀

---

*Usa `node migrate-engine.js --help` para más información*
