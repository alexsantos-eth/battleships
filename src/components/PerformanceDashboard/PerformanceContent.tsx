import { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import type { WebGLRenderer } from 'three';

interface PerformanceContentProps {
  renderer: WebGLRenderer | null;
  enabled?: boolean;
  showAdvanced?: boolean;
  onPerformanceWarning?: (message: string) => void;
}

export const PerformanceContent = ({
  renderer,
  enabled = true,
  showAdvanced = false,
  onPerformanceWarning
}: PerformanceContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: { geometries: 0, textures: 0, triangles: 0 },
    renderTime: 0,
    isLowPerformance: false
  });

  const { setContainer, getPerformanceMetrics } = usePerformanceMonitor(
    renderer,
    {
      enabled,
      position: 'top-right',
      showMemory: true,
      showRenderTime: true,
      targetFPS: 60,
      onPerformanceWarning
    }
  );

  useEffect(() => {
    if (!enabled) return;

    const updateMetrics = () => {
      const currentMetrics = getPerformanceMetrics();
      setMetrics(currentMetrics);
    };

    const interval = setInterval(updateMetrics, 1000);

    return () => clearInterval(interval);
  }, [enabled, getPerformanceMetrics]);

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return '#4CAF50';
    if (fps >= 45) return '#FF9800';
    return '#F44336';
  };

  const getMemoryUsage = () => {
    if (!renderer) return 0;
    const info = renderer.info;
    return Math.round((info.memory.geometries + info.memory.textures) / 100);
  };

  if (!enabled) return null;

  return (
    <div
      ref={setContainer}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '11px',
        cursor: 'pointer',
        minWidth: '150px',
        border: `2px solid ${getPerformanceColor(metrics.fps)}`
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>FPS: {metrics.fps}</span>
        <span style={{ color: getPerformanceColor(metrics.fps) }}>
          {metrics.isLowPerformance ? '⚠️' : '✅'}
        </span>
      </div>
      
      {isExpanded && (
        <div style={{ marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' }}>
          <div>Render: {metrics.renderTime}ms</div>
          <div>Geometries: {metrics.memory.geometries}</div>
          <div>Textures: {metrics.memory.textures}</div>
          <div>Triangles: {metrics.memory.triangles.toLocaleString()}</div>
          
          {showAdvanced && renderer && (
            <>
              <div>Memory Usage: {getMemoryUsage()}%</div>
              <div>Draw Calls: {renderer.info.render.calls}</div>
              <div>Points: {renderer.info.render.points}</div>
              <div>Lines: {renderer.info.render.lines}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}; 