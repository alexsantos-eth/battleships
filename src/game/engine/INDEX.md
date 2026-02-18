# 📚 Documentación del Motor de Juego - Índice

## 🎯 Inicio Rápido

**Si es tu primera vez aquí, empieza por:**

1. **[QUICK_START.md](./QUICK_START.md)** - ⚡ Tutorial de 5 minutos
2. **[examples.ts](./examples.ts)** - 🎮 6 ejemplos ejecutables
3. **[README.md](./README.md)** - 📖 Documentación completa

---

## 📦 ¿Quieres Mover la Librería a un Nuevo Proyecto?

### Opción 1: Script Automático (Recomendado)

```bash
node migrate-engine.js /path/to/new/project
```

Ver: **[migrate-engine.js](./migrate-engine.js)**

### Opción 2: Archivo Standalone

Copia **[standalone.ts](./standalone.ts)** - Todo en un solo archivo

### Opción 3: Manual

Sigue la guía: **[PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md)**

**Checklist:** **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)**

---

## 📁 Estructura de Archivos

### Core Engine
- **[GameEngine.ts](./GameEngine.ts)** - Motor principal (~430 líneas)
- **[AIPlayer.ts](./AIPlayer.ts)** - IA del jugador (~200 líneas)
- **[index.ts](./index.ts)** - Exportaciones públicas

### Documentación
- **[README.md](./README.md)** - API completa y ejemplos
- **[QUICK_START.md](./QUICK_START.md)** - Guía rápida de inicio
- **[PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md)** - Guía de migración completa
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Checklist de migración
- **[INDEX.md](./INDEX.md)** - Este archivo

### Utilidades
- **[examples.ts](./examples.ts)** - 6 ejemplos funcionales
- **[standalone.ts](./standalone.ts)** - Versión todo-en-uno
- **[migrate-engine.js](./migrate-engine.js)** - Script de migración
- **[MIGRATION_EXAMPLE.md](./MIGRATION_EXAMPLE.md)** - Ejemplo paso a paso

---

## 🎓 Tutoriales por Nivel

### Principiante
1. Lee [QUICK_START.md](./QUICK_START.md)
2. Corre los ejemplos básicos:
   ```typescript
   import { example1_BasicGameWithAI } from '@/game/engine';
   example1_BasicGameWithAI();
   ```

### Intermedio
1. Lee [README.md](./README.md) - Secciones API y Casos de Uso
2. Explora [examples.ts](./examples.ts) completo
3. Crea tu propia partida con callbacks

### Avanzado
1. Migra la librería con [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md)
2. Personaliza [standalone.ts](./standalone.ts)
3. Publica en npm siguiendo la guía

---

## 🔍 Búsqueda Rápida

### "¿Cómo hago X?"

| Quiero... | Ver archivo |
|-----------|-------------|
| Crear una partida básica | [QUICK_START.md](./QUICK_START.md) |
| Ver todos los métodos | [README.md](./README.md) - Sección API |
| Usar con IA | [README.md](./README.md) - Sección AIPlayer |
| Conectar con UI | [README.md](./README.md) - Callbacks |
| Mover a nuevo proyecto | [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) |
| Un solo archivo | [standalone.ts](./standalone.ts) |
| Script automático | [migrate-engine.js](./migrate-engine.js) |
| Testing | [README.md](./README.md) - Sección Testing |
| Ejemplos | [examples.ts](./examples.ts) |

---

## 🚀 Guías por Caso de Uso

### Crear un Juego Web
1. Usa `GameEngine` directamente
2. Conecta con React/Vue/Angular via callbacks
3. Ver [README.md](./README.md) - Sección "Integración con UI"

### Simulaciones Headless
1. Importa `GameEngine` y `AIPlayer`
2. Ejecuta partidas sin UI
3. Ver [examples.ts](./examples.ts) - Ejemplo 4 y 6

### Servidor Multiplayer
1. Migra con [migrate-engine.js](./migrate-engine.js)
2. Usa en Node.js
3. Ver [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) - Sección "Node.js"

### Publicar en npm
1. Sigue [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) - Opción 3
2. Configura package.json
3. `npm publish`

---

## 📊 Comparación de Opciones de Migración

| Método | Archivo | Tiempo | Mejor para |
|--------|---------|--------|------------|
| Script | [migrate-engine.js](./migrate-engine.js) | 1 min | Proyectos nuevos |
| Standalone | [standalone.ts](./standalone.ts) | 30 seg | Experimentos rápidos |
| Manual | [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) | 10 min | Máximo control |

---

## 🎯 Acciones Comunes

### Ejecutar Ejemplos

```typescript
import { runAllEngineExamples } from '@/game/engine';
runAllEngineExamples();
```

### Migrar Automáticamente

```bash
node src/game/engine/migrate-engine.js ~/mi-proyecto
```

### Copiar Standalone

```bash
cp src/game/engine/standalone.ts ~/mi-proyecto/
```

---

## 📞 Ayuda

### Tengo un problema
1. Revisa [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) - Sección "Solución de Problemas"
2. Verifica errores de TypeScript
3. Comprueba que todos los archivos estén copiados

### Quiero aprender más
1. Lee [README.md](./README.md) completo
2. Ejecuta todos los ejemplos en [examples.ts](./examples.ts)
3. Experimenta con [standalone.ts](./standalone.ts)

### Quiero contribuir
1. Entiende la arquitectura en [README.md](./README.md)
2. Revisa el código en [GameEngine.ts](./GameEngine.ts) y [AIPlayer.ts](./AIPlayer.ts)
3. Añade ejemplos en [examples.ts](./examples.ts)

---

## ✨ Características Principales

- ✅ **Cero dependencias npm**
- ✅ **100% TypeScript**
- ✅ **Portable a cualquier entorno**
- ✅ **Totalmente testeable**
- ✅ **Documentación completa**
- ✅ **Ejemplos ejecutables**
- ✅ **Script de migración**
- ✅ **Versión standalone**

---

## 🎉 ¡Listo para Empezar!

**Siguiente paso recomendado:**

```bash
# Leer guía rápida
cat QUICK_START.md

# O ejecutar ejemplos
npm run dev  # Si estás en el proyecto original
```

---

## 📖 Referencias Completas

| Documento | Líneas | Descripción |
|-----------|--------|-------------|
| [README.md](./README.md) | ~600 | API completa, casos de uso, ejemplos |
| [QUICK_START.md](./QUICK_START.md) | ~300 | Tutorial rápido en español |
| [PORTABILITY_GUIDE.md](./PORTABILITY_GUIDE.md) | ~500 | Guía completa de migración |
| [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) | ~250 | Checklist y resumen |
| [examples.ts](./examples.ts) | ~400 | 6 ejemplos ejecutables |
| [standalone.ts](./standalone.ts) | ~600 | Todo-en-uno portable |
| [GameEngine.ts](./GameEngine.ts) | ~430 | Implementación del motor |
| [AIPlayer.ts](./AIPlayer.ts) | ~200 | Implementación de IA |

**Total: ~3,280 líneas de código y documentación** 📚

---

*Última actualización: Febrero 2026*
