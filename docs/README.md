# Armada.io - Documentación Técnica

## 🎯 Descripción General

**Armada.io** es un juego de batalla naval moderno desarrollado con React, TypeScript y Three.js. El proyecto implementa un sistema completo de juego con IA enemiga, validación robusta, y una arquitectura escalable con funcionalidades multiplayer.

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
- [Testing Summary](./TESTING_SUMMARY.md) - Estado actual de tests y cobertura

### 🌐 **Multiplayer y Networking**
- [Guía Multiplayer](./MULTIPLAYER_GUIDE.md) - Sistema de juego multijugador
- [Guía de Salas](./MULTIPLAYER_MATCH_GUIDE.md) - Gestión de salas y partidas
- [Base de Datos en Tiempo Real](./REALTIME_DATABASE_GUIDE.md) - Firebase Realtime Database
- [Solución de Problemas Firebase](./FIREBASE_REALTIME_DB_TROUBLESHOOTING.md) - Troubleshooting

## 🚀 **Características Principales**

### ✅ **Funcionalidades Implementadas**
- **Sistema de Juego Completo**: Lógica de batalla naval con turnos
- **IA Enemiga**: Generación automática de tiros enemigos inteligentes
- **Validación Robusta**: Verificación de configuraciones y estados
- **Sistema de Cámara**: Transiciones suaves entre vistas con eventos
- **Interfaz Moderna**: UI responsiva con Three.js y efectos visuales
- **Sistema de Debug**: Herramientas de desarrollo integradas
- **Multiplayer**: Sistema completo de salas y partidas multijugador
- **Autenticación**: Sistema de usuarios con Firebase Auth
- **Perfiles de Usuario**: Estadísticas y historial de partidas
- **Base de Datos en Tiempo Real**: Sincronización de estado del juego

### ✅ **Calidad de Código**
- **83 pruebas unitarias** pasando exitosamente
- **3 suites de tests** con cobertura completa en módulos críticos
- **Validación de tipos** TypeScript completa
- **Arquitectura escalable** con separación de responsabilidades
- **Documentación exhaustiva** de todas las funcionalidades

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **React 19.1.0** - Framework principal
- **TypeScript 5.8.3** - Tipado estático
- **Three.js 0.178.0** - Gráficos 3D
- **@react-three/fiber 9.2.0** - React renderer para Three.js
- **@react-three/drei 10.5.1** - Utilidades para React Three Fiber
- **Zustand 5.0.6** - Gestión de estado
- **Vite 7.0.4** - Build tool y dev server

### **Backend y Base de Datos**
- **Firebase 12.0.0** - Backend as a Service
- **Firebase Auth** - Autenticación de usuarios
- **Firebase Realtime Database** - Base de datos en tiempo real
- **Firestore** - Base de datos de documentos

### **Testing**
- **Jest 30.0.5** - Framework de pruebas
- **React Testing Library** - Pruebas de componentes
- **Cobertura 100%** en módulos críticos del juego

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Tailwind CSS** - Framework de estilos
- **PostCSS** - Procesamiento de CSS

## 📊 **Métricas de Calidad**

### **Cobertura de Pruebas**
- **GameInitializer**: 100% (Statements, Branches, Functions, Lines)
- **Ship Calculations**: 71.01% coverage
- **Constants**: 100% coverage
- **Total del Proyecto**: 9.82% coverage general
- **83 tests** pasando, 0 fallando

### **Performance**
- **Tiempo de Ejecución**: 17.946s para suite completa
- **Build Time**: Optimizado con Vite
- **Bundle Size**: Minimizado y optimizado

### **Arquitectura**
- **Módulos con 100% cobertura**: 3 archivos críticos
- **Estructura modular**: Separación clara de responsabilidades
- **TypeScript**: Tipado completo en todo el proyecto

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

### **Multiplayer**
- **Crear Sala**: Generar código de sala para compartir
- **Unirse a Sala**: Ingresar código de sala existente
- **Chat en Tiempo Real**: Comunicación durante la partida
- **Sincronización**: Estado del juego sincronizado automáticamente

## 🔧 **Desarrollo**

### **Instalación**
```bash
# Clonar repositorio
git clone [repository-url]
cd armada-io

# Usar Node.js 20
nvm use 20

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
- **`/src/bundle/`** - Componentes del juego 3D y lógica principal
- **`/src/components/ui/`** - Componentes de interfaz de usuario
- **`/src/game/manager/`** - Lógica del juego y algoritmos
- **`/src/hooks/`** - Hooks personalizados
- **`/src/stores/`** - Gestión de estado con Zustand
- **`/src/network/`** - Funcionalidades de networking y multiplayer
- **`/src/auth/`** - Sistema de autenticación
- **`/src/types/`** - Definiciones de tipos TypeScript

### **Convenciones de Código**
- **TypeScript**: Tipado estático completo
- **ESLint**: Reglas estrictas de calidad
- **Componentes**: Funcionales con hooks
- **Estado**: Zustand para gestión global
- **Testing**: Jest + React Testing Library
- **Sin comentarios**: Código autoexplicativo (preferencia del usuario)

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 