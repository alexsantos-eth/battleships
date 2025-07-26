# Performance Monitor

Un sistema completo de monitoreo de performance para aplicaciones Three.js/React que proporciona métricas en tiempo real de FPS, memoria y tiempo de renderizado.

## 🚀 Características

- **Monitoreo en Tiempo Real**: FPS, memoria GPU, tiempo de renderizado
- **Integración con Three.js**: Métricas específicas del renderer WebGL
- **Interfaz Configurable**: Posicionamiento y paneles personalizables
- **Alertas de Performance**: Notificaciones automáticas cuando el FPS baja
- **Hook Personalizado**: `usePerformanceMonitor` para integración avanzada
- **Dashboard Interactivo**: Interfaz expandible con métricas detalladas

## 📦 Instalación

```bash
npm install stats.js
npm install --save-dev @types/stats.js
```

## 🎯 Uso Básico

### Componente PerformanceMonitor

```tsx
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

function App() {
  return (
    <div>
      <PerformanceMonitor 
        enabled={true}
        position="top-right"
        showMemory={true}
        showRenderTime={true}
      />
      {/* Tu aplicación aquí */}
    </div>
  );
}
```

### Componente PerformanceDashboard

```tsx
import { PerformanceDashboard } from '@/components/PerformanceDashboard';
import { useThree } from '@react-three/fiber';

function Game() {
  const { gl } = useThree();
  
  return (
    <>
      <PerformanceDashboard
        renderer={gl}
        enabled={true}
        position="top-right"
        showAdvanced={true}
        onPerformanceWarning={(message) => console.warn(message)}
      />
      {/* Tu juego aquí */}
    </>
  );
}
```

## 🔧 Configuración

### Configuración Global (DEBUG_CONFIG)

El performance monitor se puede configurar globalmente en `src/utils/debug.ts`:

```typescript
export const DEBUG_CONFIG = {
  // Performance Monitor Configuration
  ENABLE_PERFORMANCE_MONITOR: true,
  PERFORMANCE_MONITOR_POSITION: 'top-right' as const,
  SHOW_ADVANCED_METRICS: false,
  PERFORMANCE_WARNINGS_ENABLED: true,
  TARGET_FPS: 60,
} as const;
```

### Props del PerformanceMonitor

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `enabled` | `boolean` | `DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR` | Habilita/deshabilita el monitor |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION` | Posición del panel |
| `showMemory` | `boolean` | `true` | Muestra panel de memoria |
| `showRenderTime` | `boolean` | `true` | Muestra panel de tiempo de renderizado |

### Props del PerformanceDashboard

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `renderer` | `WebGLRenderer \| null` | `null` | Renderer de Three.js |
| `enabled` | `boolean` | `DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR` | Habilita/deshabilita el dashboard |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION` | Posición del dashboard |
| `showAdvanced` | `boolean` | `DEBUG_CONFIG.SHOW_ADVANCED_METRICS` | Muestra métricas avanzadas |
| `onPerformanceWarning` | `(message: string) => void` | `undefined` | Callback para alertas |

## 🎮 Hook usePerformanceMonitor

Para integración avanzada y control granular:

```tsx
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useThree } from '@react-three/fiber';

function Game() {
  const { gl } = useThree();
  
  const {
    setContainer,
    getPerformanceMetrics,
    beginMeasure,
    endMeasure,
    isEnabled,
    stats
  } = usePerformanceMonitor(gl, {
    enabled: true,
    position: 'top-right',
    showMemory: true,
    showRenderTime: true,
    targetFPS: 60,
    onPerformanceWarning: (message) => console.warn(message)
  });

  // Medir performance manualmente
  const renderFrame = () => {
    beginMeasure();
    // Tu lógica de renderizado aquí
    endMeasure();
  };

  // Obtener métricas actuales
  const metrics = getPerformanceMetrics();
  console.log('FPS:', metrics.fps);
  console.log('Memory:', metrics.memory);
  console.log('Render Time:', metrics.renderTime);

  return (
    <div ref={setContainer}>
      {/* Tu aplicación aquí */}
    </div>
  );
}
```

## 📊 Métricas Disponibles

### FPS (Frames Per Second)
- **Verde**: ≥55 FPS (Excelente)
- **Naranja**: 45-54 FPS (Bueno)
- **Rojo**: <45 FPS (Necesita optimización)

### Memoria GPU
- **Geometrías**: Número de geometrías en memoria
- **Texturas**: Número de texturas cargadas
- **Triángulos**: Número total de triángulos renderizados

### Tiempo de Renderizado
- **Tiempo por frame**: Milisegundos por frame
- **Uso de CPU**: Tiempo de procesamiento

### Métricas Avanzadas (Three.js)
- **Draw Calls**: Llamadas de renderizado
- **Points**: Número de puntos
- **Lines**: Número de líneas
- **Memory Usage**: Porcentaje de uso de memoria

## 🎯 Integración con App.tsx

El performance monitor ya está integrado en la aplicación principal y usa la configuración de debug:

```tsx
// En App.tsx
<PerformanceDashboard
  renderer={null} // Se conecta automáticamente
  enabled={showPerformanceMonitor}
  position={DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION}
  showAdvanced={DEBUG_CONFIG.SHOW_ADVANCED_METRICS}
  onPerformanceWarning={handlePerformanceWarning}
/>
```

### Configuración Rápida

Para habilitar/deshabilitar el performance monitor, modifica `src/utils/debug.ts`:

```typescript
// Para desarrollo
ENABLE_PERFORMANCE_MONITOR: true,
SHOW_ADVANCED_METRICS: true,

// Para producción
ENABLE_PERFORMANCE_MONITOR: false,
SHOW_ADVANCED_METRICS: false,
```

### Atajos de Teclado
- **P**: Toggle del performance monitor (solo si está habilitado en DEBUG_CONFIG)
- El indicador se muestra en la esquina inferior izquierda (solo si está habilitado)

## 🔍 Debugging y Optimización

### Alertas Automáticas
El sistema detecta automáticamente problemas de performance:
- FPS bajo (<80% del target)
- Uso excesivo de memoria
- Tiempo de renderizado alto

### Logs de Performance
```tsx
const handlePerformanceWarning = (message: string) => {
  console.warn('Performance Warning:', message);
  // Enviar a servicio de analytics
  // Mostrar notificación al usuario
  // Reducir calidad gráfica automáticamente
};
```

## 🧪 Testing

```bash
# Ejecutar tests del performance monitor
npm test -- --testPathPatterns=PerformanceMonitor

# Ejecutar todos los tests
npm test
```

## 📈 Mejores Prácticas

1. **Habilitar en Desarrollo**: Siempre tener el monitor activo durante desarrollo
2. **Monitorear en Producción**: Usar métricas para optimización continua
3. **Configurar Alertas**: Implementar callbacks para problemas críticos
4. **Optimizar Basado en Métricas**: Usar datos para guiar optimizaciones
5. **Documentar Cambios**: Registrar mejoras de performance

## 🔧 Troubleshooting

### El monitor no aparece
- Verificar que `enabled={true}`
- Comprobar que el renderer esté disponible
- Revisar z-index y posicionamiento

### Métricas incorrectas
- Asegurar que `beginMeasure()` y `endMeasure()` se llamen correctamente
- Verificar que el renderer sea válido
- Comprobar que stats.js esté instalado correctamente

### Performance del monitor
- El monitor tiene overhead mínimo (<1ms por frame)
- Deshabilitar en builds de producción si es necesario
- Usar `showAdvanced={false}` para reducir overhead

## 📚 Referencias

- [stats.js Documentation](https://github.com/mrdoob/stats.js/)
- [Three.js Performance](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) 