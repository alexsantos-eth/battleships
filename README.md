# 🚢 Armada.io

Un juego de armada inmersivo desarrollado con React, TypeScript y Three.js que combina la clásica mecánica de armada con gráficos 3D modernos y efectos visuales espectaculares.

![Armada.io](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.178.0-green)
![Zustand](https://img.shields.io/badge/Zustand-5.0.6-purple)

## 🎮 Características

- **🎯 Gráficos 3D Inmersivos**: Experiencia visual completa con Three.js
- **⚡ Rendimiento Optimizado**: Animaciones fluidas y gestión eficiente de memoria
- **🎨 Efectos Visuales**: Explosiones de agua, partículas y animaciones dinámicas
- **🔄 Sistema de Turnos**: Mecánica clásica de armada
- **🎲 IA Enemiga**: Oponente con comportamiento inteligente
- **📱 Responsive**: Compatible con dispositivos móviles y desktop
- **🔧 Debug Tools**: Panel de debug y monitoreo de rendimiento

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js 20+** (recomendado usar `nvm use 20`)
- **npm** o **yarn**

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd armada-io

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El juego estará disponible en `http://localhost:5173`

### Comandos Disponibles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
npm run lint             # Verificar código
npm run run:deterministic # Simulación determinística
```

## 📚 Documentación

### 📖 [Documentación Completa](docs/DOCUMENTACION.md)
Guía detallada que cubre todos los aspectos del juego:
- Arquitectura y diseño del sistema
- Lógica del juego y mecánicas
- Componentes visuales y efectos
- Sistema de cámara y eventos
- Optimización y rendimiento

### 🔄 [Diagramas de Flujo](docs/DIAGRAMA_FLUJO.md)
Visualizaciones del funcionamiento del juego:
- Flujo principal del juego
- Arquitectura de componentes
- Diagramas de secuencia y estados
- Estructura de datos
- Gestión de memoria

### 🔧 [Referencia de API](docs/API_REFERENCE.md)
Documentación técnica completa:
- GameStore y gestión de estado
- Clases y métodos del juego
- Hooks personalizados
- Componentes React
- Tipos y interfaces

### 📋 [Guía de Constantes](docs/CONSTANTS_GUIDE.md)
Guía de constantes y configuración del sistema:
- Constantes del juego y configuración
- Parámetros de rendimiento
- Configuración de efectos visuales
- Valores por defecto del sistema

### 📊 [Performance Monitor](docs/README.md)
Documentación del sistema de monitoreo de rendimiento:
- Componente PerformanceMonitor
- Métricas y análisis de rendimiento
- Herramientas de debugging
- Optimización del sistema

### 🎮 [Simulaciones](docs/SIMULATIONS.md)
Documentación de las simulaciones de batalla:
- Simulaciones predefinidas para testing
- Tipos de simulaciones disponibles
- Uso en debug panel y testing
- Configuración de parámetros



## 🎯 Cómo Jugar

### Controles
- **Click**: Disparar en celdas del tablero enemigo
- **P**: Alternar panel de debug
- **Cámara**: Cambio automático de perspectiva

### Objetivo
Destruir todos los barcos enemigos antes de que destruyan los tuyos.

### Tipos de Barcos
- **Small**: 2 celdas
- **Medium**: 3 celdas
- **Large**: 4 celdas
- **XLarge**: 5 celdas

## 🧪 Testing y Calidad

### Cobertura de Tests
- **Cobertura General**: 76.97% (statements), 42.55% (branches)
- **game/logic**: 94.68% de cobertura (módulo crítico)
- **Archivos con 100%**: 8 archivos críticos del sistema
- **Tests Ejecutándose**: 317 tests pasando, 100% éxito

### IA Enemiga
- **IA Aleatoria**: Ejecución automática de tiros enemigos
- **Turnos automáticos**: Transición fluida entre jugador y enemigo
- **Generación inteligente**: Posiciones de disparo aleatorias pero válidas

### Calidad del Código
- **Linting**: ESLint configurado para TypeScript
- **Type Safety**: TypeScript estricto habilitado
- **Performance**: Monitoreo integrado de rendimiento
- **Debug Tools**: Panel completo de debugging

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend**: React 19.1.0, TypeScript 5.8.3
- **3D Graphics**: Three.js 0.178.0, @react-three/fiber 9.2.0
- **Animaciones**: @react-spring/three 10.0.1
- **Estado Global**: Zustand 5.0.6
- **Build Tool**: Vite 7.0.4
- **Testing**: Jest 30.0.5

### Estructura del Proyecto
```
src/
├── components/          # Componentes React
├── game/logic/         # Lógica del juego
├── stores/             # Estado global (Zustand)
├── hooks/              # Hooks personalizados
├── utils/              # Utilidades
└── env/                # Configuración 3D
```

## 🎨 Características Técnicas

### Gestión de Estado
- **Zustand** para estado global centralizado
- **EventBus** para comunicación entre componentes
- **Hooks personalizados** para lógica reutilizable

### Rendimiento
- **useFrame** para animaciones eficientes
- **Cleanup automático** de objetos 3D
- **Memoización** de cálculos costosos
- **Monitoreo de rendimiento** integrado

### Efectos Visuales
- **WaterExplosion**: Efectos de partículas para impactos
- **Droplet**: Sistema de gotas de agua
- **Animaciones de cámara**: Transiciones suaves
- **Efectos de iluminación**: Ambiente dinámico

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, consulta nuestra [Documentación Completa](docs/DOCUMENTACION.md) para:

- Configurar el entorno de desarrollo
- Entender las convenciones de código
- Proceso de testing y debugging
- Guías para pull requests

### Reportar Bugs
Si encuentras un bug, por favor:
1. Revisa los issues existentes
2. Crea un nuevo issue con detalles específicos
3. Incluye pasos para reproducir el problema

### Solicitar Funcionalidades
Para nuevas funcionalidades:
1. Describe la funcionalidad propuesta
2. Explica el caso de uso
3. Considera la implementación técnica

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **React Three Fiber** por el excelente framework 3D
- **Three.js** por la biblioteca de gráficos 3D
- **Zustand** por la gestión de estado simple y eficiente
- **Vite** por el bundler rápido y moderno

## 🔗 Enlaces Útiles

- [Demo en Vivo](#) *(próximamente)*
- [Changelog](CHANGELOG.md) - Historial de cambios
- [Roadmap](#) *(próximamente)*

---

**¡Disfruta jugando Armada.io! 🚢💥**
