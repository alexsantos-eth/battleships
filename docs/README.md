# Armada.io - Documentación Técnica

## 🎯 Descripción General

**Armada.io** es un juego de batalla naval moderno desarrollado con React, TypeScript y Three.js. El proyecto implementa un sistema completo de juego con IA enemiga, validación robusta, y una arquitectura escalable.

## 📚 Índice de Documentación

### 🏗️ **Arquitectura y Estructura**
- [Diagrama de Flujo](./DIAGRAMA_FLUJO.md) - Flujo del juego con Mermaid
- [Estándares y Buenas Prácticas](./ESTANDARES_BUENAS_PRACTICAS.md) - Guías de desarrollo

### 🔧 **Componentes y Lógica**
- [Agrupación de Componentes](./AGRUPACION_COMPONENTES_COMPLETADA.md) - Estructura de componentes
- [Limpieza de Código](./LIMPIEZA_CODIGO_COMPLETADA.md) - Optimizaciones y eliminación de archivos innecesarios

### 📖 **Referencias Técnicas**
- [API Reference](./API_REFERENCE.md) - Documentación completa de APIs
- [Guía de Constantes](./CONSTANTS_GUIDE.md) - Configuración del juego
- [Documentación General](./DOCUMENTACION.md) - Información técnica detallada

## 🚀 **Características Principales**

### ✅ **Funcionalidades Implementadas**
- **Sistema de Juego Completo**: Lógica de batalla naval con turnos
- **IA Enemiga**: Generación automática de tiros enemigos
- **Validación Robusta**: Verificación de configuraciones y estados
- **Sistema de Cámara**: Transiciones suaves entre vistas
- **Interfaz Moderna**: UI responsiva con Three.js
- **Sistema de Debug**: Herramientas de desarrollo integradas

### ✅ **Calidad de Código**
- **100% Coverage** en módulos críticos (GameInitializer)
- **25 pruebas unitarias** para lógica principal
- **Validación de tipos** TypeScript completa
- **Arquitectura escalable** con separación de responsabilidades
- **Documentación exhaustiva** de todas las funcionalidades

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Three.js** - Gráficos 3D
- **Zustand** - Gestión de estado
- **Vite** - Build tool y dev server

### **Testing**
- **Jest** - Framework de pruebas
- **React Testing Library** - Pruebas de componentes
- **Coverage 100%** en módulos críticos

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks

## 📊 **Métricas de Calidad**

### **Cobertura de Pruebas**
- **GameInitializer**: 100% (Statements, Branches, Functions, Lines)
- **Lógica de Juego**: 94.68% coverage
- **Total del Proyecto**: 76.97% coverage
- **317 tests** pasando, 0 fallando

### **Performance**
- **Tiempo de Ejecución**: 11.94s para suite completa
- **Build Time**: Optimizado con Vite
- **Bundle Size**: Minimizado y optimizado

## 🎮 **Cómo Jugar**

### **Objetivo**
Destruir todos los barcos enemigos antes de que destruyan los tuyos.

### **Controles**
- **Click**: Disparar en posición seleccionada
- **Cámara**: Transición automática entre turnos
- **Debug**: Panel de herramientas para desarrollo

### **Configuraciones de Juego**
- **Quick Game**: 8x8, 4 barcos
- **Classic Game**: 10x10, 10 barcos
- **Challenging Game**: 12x12, 15 barcos

## 🔧 **Desarrollo**

### **Instalación**
```bash
# Clonar repositorio
git clone [repository-url]
cd armada-io

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Comandos de Desarrollo**
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
npm run lint             # Verificar código
```

## 📝 **Notas de Desarrollo**

### **Estructura del Proyecto**
- **`/src/components/`** - Componentes React organizados por funcionalidad
- **`/src/game/logic/`** - Lógica del juego y algoritmos
- **`/src/hooks/`** - Hooks personalizados
- **`/src/stores/`** - Gestión de estado con Zustand
- **`/src/types/`** - Definiciones de tipos TypeScript

### **Convenciones de Código**
- **TypeScript**: Tipado estático completo
- **ESLint**: Reglas estrictas de calidad
- **Componentes**: Funcionales con hooks
- **Estado**: Zustand para gestión global
- **Testing**: Jest + React Testing Library

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 