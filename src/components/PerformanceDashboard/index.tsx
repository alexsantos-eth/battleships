import { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import type { WebGLRenderer } from 'three';

interface PerformanceDashboardProps {
  renderer: WebGLRenderer | null;
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showAdvanced?: boolean;
  onPerformanceWarning?: (message: string) => void;
}

export const PerformanceDashboard = ({
  renderer,
  enabled = true,
  position = 'top-right',
  showAdvanced = false,
  onPerformanceWarning
}: PerformanceDashboardProps) => {
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
      position,
      showMemory: true,
      showRenderTime: true,
      targetFPS: 60,
      onPerformanceWarning
    }
  );

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = getPerformanceMetrics();
      setMetrics(currentMetrics);
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [getPerformanceMetrics]);

  const getFpsColor = (fps: number) => {
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
        position: 'fixed',
        top: position.includes('top') ? '10px' : 'auto',
        bottom: position.includes('bottom') ? '10px' : 'auto',
        left: position.includes('left') ? '10px' : 'auto',
        right: position.includes('right') ? '10px' : 'auto',
        zIndex: 999,
        pointerEvents: 'auto'
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '12px',
          cursor: 'pointer',
          minWidth: '150px',
          border: `2px solid ${getFpsColor(metrics.fps)}`
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>FPS: {metrics.fps}</span>
          <span style={{ color: getFpsColor(metrics.fps) }}>
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
    </div>
  );
};

export default PerformanceDashboard; 