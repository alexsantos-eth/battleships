# 🚀 Ejemplo de Uso del Script de Migración

## ✅ Script Corregido y Funcionando

El script de migración ha sido actualizado para ser compatible con módulos ES (ESM) de Node.js.

## 📋 Comandos Disponibles

### Ver Ayuda

```bash
node src/game/engine/migrate-engine.js --help
```

### Migrar a un Nuevo Proyecto

```bash
# Migración básica
node src/game/engine/migrate-engine.js /path/to/new/project

# Ejemplo con ruta específica
node src/game/engine/migrate-engine.js ~/Desktop/battleship-engine
```

### Migrar como Paquete npm

```bash
node src/game/engine/migrate-engine.js /path/to/new/project --npm
```

## 🎯 Ejemplo Completo

```bash
# 1. Crear directorio destino
mkdir ~/Desktop/my-battleship-game

# 2. Migrar la librería
node src/game/engine/migrate-engine.js ~/Desktop/my-battleship-game

# 3. Ir al proyecto
cd ~/Desktop/my-battleship-game

# 4. Instalar dependencias
npm install

# 5. Ejecutar ejemplos (opcional)
npm run dev
```

## 📦 Lo que Hace el Script

### Archivos Copiados

✅ **Core Engine**
- `src/engine/GameEngine.ts`
- `src/engine/AIPlayer.ts`
- `src/engine/index.ts`
- `src/engine/examples.ts`

✅ **Utilidades**
- `src/tools/ship/calculations.ts`

✅ **Tipos**
- `src/types/common.ts`
- `src/types/config.ts`

✅ **Constantes**
- `src/constants/game.ts` (generado automáticamente)

✅ **Documentación**
- `README.md`
- `QUICK_START.md`

### Archivos Generados

✅ `package.json` - Configuración del paquete
✅ `tsconfig.json` - Configuración de TypeScript
✅ `.gitignore` - Archivos ignorados por Git

### Transformaciones Automáticas

El script transforma los imports automáticamente:

```typescript
// Antes (en este proyecto)
import { GameEngine } from "@/game/engine";
import { generateShips } from "@/tools/ship/calculations";
import type { GameShip } from "@/types/game/common";

// Después (en el proyecto migrado)
import { GameEngine } from "./index";
import { generateShips } from "../../tools/ship/calculations";
import type { GameShip } from "../../types/common";
```

## 🧪 Verificación Post-Migración

Después de migrar, verifica que todo funcione:

```bash
cd /path/to/new/project

# Debería compilar sin errores
npx tsc

# Debería mostrar la estructura
tree -L 2 src/
```

Estructura esperada:

```
src/
├── constants/
│   └── game.ts
├── engine/
│   ├── AIPlayer.ts
│   ├── GameEngine.ts
│   ├── examples.ts
│   └── index.ts
├── tools/
│   └── ship/
│       └── calculations.ts
└── types/
    ├── common.ts
    └── config.ts
```

## 🎮 Probar la Librería Migrada

```bash
cd /path/to/new/project

# Opción 1: Compilar y ejecutar
npm run build
node dist/engine/examples.js

# Opción 2: Ejecutar directamente con ts-node
npm install -g ts-node
npm run dev
```

## 📝 Personalizar el Proyecto Migrado

Después de migrar, edita:

```json
// package.json
{
  "name": "tu-nombre-de-paquete",    // Cambiar
  "version": "1.0.0",                 // Tu versión
  "author": "Tu Nombre",              // Tu nombre
  "license": "MIT",                   // Tu licencia
  // ... resto
}
```

## 🚀 Publicar en npm (Opcional)

```bash
cd /path/to/new/project

# 1. Compilar
npm run build

# 2. Login en npm
npm login

# 3. Publicar
npm publish
```

## 💡 Alternativas Rápidas

### Solo Copiar el Standalone

Si solo necesitas un archivo:

```bash
cp src/game/engine/standalone.ts ~/mi-proyecto/battleship.ts
```

### Usar en Nuevo Proyecto sin Migrar

```bash
# Instalar TypeScript path mapping en tu proyecto destino
# tsconfig.json:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["../armada/src/*"]
    }
  }
}
```

## 🆘 Solución de Problemas

### Error: "Cannot find module"

```bash
# Verificar que se instalaron las dependencias
npm install
```

### Error: TypeScript no compila

```bash
# Verificar que todos los archivos se copiaron
ls -R src/
```

### Error: Imports no encontrados

```bash
# Ejecutar el script de nuevo
node src/game/engine/migrate-engine.js /path/to/project
```

## ✨ Resumen

El script de migración:
- ✅ **Es automático** - Copia y transforma todo
- ✅ **Sin dependencias npm** - Solo TypeScript puro
- ✅ **100% funcional** - Listo para usar
- ✅ **Totalmente portable** - Funciona en cualquier entorno

**¡Ahora puedes mover tu librería a cualquier proyecto en segundos!** 🎉
