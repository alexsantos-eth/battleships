# Changelog - Armada.io

Todos los cambios notables en el proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentación completa del proyecto con múltiples archivos
- Sistema de diagramas de flujo con Mermaid
- Referencia de API completa
- Guía de desarrollo para contribuidores
- Homepage de documentación en README.md
- Renombrado del proyecto a "Armada.io"

### Changed
- Actualización de terminología: "batalla naval" → "armada"
- Refactorización de nombres de clases en documentación
- Mejora de la estructura de documentación

### Fixed
- Consistencia en nomenclatura del proyecto
- Actualización de referencias en archivos de configuración

## [0.1.0] - 2024-01-XX

### Added
- **Sistema de Fin de Juego**: Implementación completa de lógica de victoria/derrota
  - Detección automática de barcos destruidos
  - Verificación de condiciones de fin de juego
  - Modal de victoria/derrota con opción de reinicio
  - Reinicialización completa del estado del juego

- **GameOverModal Component**: 
  - Modal visual para mostrar resultado del juego
  - Mensajes personalizados según ganador
  - Botón de reinicio funcional
  - Estilos modernos y responsivos

- **Lógica de Verificación de Barcos**:
  - Función `isShipDestroyed()` para verificar barcos completos
  - Función `checkGameOver()` para determinar fin de juego
  - Integración con el sistema de disparos existente

### Changed
- **GameStore**: 
  - Agregadas propiedades `isGameOver` y `winner`
  - Implementada función `resetGame()` para reinicio completo
  - Mejorada función `checkGameOver()` con verificación de victoria
  - Integración automática con sistema de disparos

- **Sistema de Turnos**:
  - Mejorada sincronización entre turnos y fin de juego
  - Integración con eventos de cámara para transiciones suaves

### Technical Details
- **Gestión de Estado**: Uso de Zustand para estado global consistente
- **Eventos**: Sistema de eventos para comunicación entre componentes
- **Performance**: Optimización de verificaciones de fin de juego
- **Testing**: Cobertura de tests para nuevas funcionalidades

## [0.0.1] - 2024-01-XX

### Added
- **Sistema Base del Juego**:
  - Arquitectura React + TypeScript + Three.js
  - Sistema de gestión de estado con Zustand
  - Componentes 3D para tableros de juego
  - Sistema de disparos y detección de impactos

- **Componentes Principales**:
  - `GameGrid`: Tableros de juego 3D
  - `PressGrid`: Interacción de disparos del jugador
  - `ShipsPlane`: Renderizado de barcos
  - `WaterExplosion`: Efectos visuales de impactos
  - `CameraController`: Sistema de cámara dinámico

- **Lógica del Juego**:
  - Clase `BattleshipGame` para lógica principal
  - Generación aleatoria de barcos
  - Sistema de turnos jugador/enemigo
  - Verificación de disparos y impactos

- **Sistema de Efectos Visuales**:
  - Explosiones de agua con partículas
  - Animaciones de cámara suaves
  - Efectos de iluminación dinámica
  - Sistema de partículas para gotas de agua

- **Herramientas de Desarrollo**:
  - Panel de debug (tecla P)
  - Monitoreo de rendimiento
  - Sistema de eventos para debugging
  - Tests unitarios con Jest

### Technical Stack
- **Frontend**: React 19.1.0, TypeScript 5.8.3
- **3D Graphics**: Three.js 0.178.0, @react-three/fiber 9.2.0
- **Animaciones**: @react-spring/three 10.0.1
- **Estado Global**: Zustand 5.0.6
- **Build Tool**: Vite 7.0.4
- **Testing**: Jest 30.0.5

### Architecture
- **Estado Global**: Zustand store centralizado
- **Eventos**: Sistema EventBus para comunicación
- **Componentes**: Arquitectura modular React
- **3D Rendering**: Three.js con React Three Fiber
- **Performance**: Optimización con useFrame y cleanup automático

---

## Notas de Versión

### Convenciones de Versionado
- **MAJOR.MINOR.PATCH** (ej: 1.2.3)
- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs compatibles

### Categorías de Cambios
- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades que serán removidas
- **Removed**: Funcionalidades removidas
- **Fixed**: Correcciones de bugs
- **Security**: Mejoras de seguridad

### Contribución al Changelog
- Mantener entradas en orden cronológico inverso
- Incluir detalles técnicos relevantes
- Agrupar cambios relacionados
- Usar lenguaje claro y descriptivo
- Incluir referencias a issues/PRs cuando sea apropiado

---

## Roadmap

### Próximas Versiones

#### [0.2.0] - Próximamente
- **IA Avanzada**: Estrategias más inteligentes para el enemigo
- **Efectos de Sonido**: Integración de audio
- **Animaciones Avanzadas**: Más efectos visuales
- **Modo Historia**: Campaña con múltiples niveles

#### [0.3.0] - Futuro
- **Multiplayer**: Soporte para juego en red
- **Diferentes Modos**: Variaciones del juego
- **Persistencia**: Guardado de partidas
- **Estadísticas**: Seguimiento de rendimiento

#### [1.0.0] - Lanzamiento
- **Versión Estable**: Todas las funcionalidades principales
- **Documentación Completa**: Guías de usuario
- **Optimización**: Rendimiento máximo
- **Testing**: Cobertura completa de tests

---

**¡Gracias por jugar Armada.io! 🚢💥** 