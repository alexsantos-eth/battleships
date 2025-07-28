import { useEffect, useRef } from "react";
import Stats from "stats.js";
import type { PerformanceMonitorProps } from './PerformanceMonitor.types';

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  position = "top-left",
  showMemory = true,
  showRenderTime = true,
  className = '',
}) => {
  const statsRef = useRef<Stats | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const stats = new Stats();
    statsRef.current = stats;

    const container = containerRef.current;
    if (container) {
      container.appendChild(stats.dom);

      const statsDom = stats.dom as HTMLElement;
      statsDom.style.position = "absolute";
      statsDom.style.zIndex = "1000";

      switch (position) {
        case "top-left":
          statsDom.style.top = "10px";
          statsDom.style.left = "10px";
          break;
        case "top-right":
          statsDom.style.top = "10px";
          statsDom.style.right = "10px";
          break;
        case "bottom-left":
          statsDom.style.bottom = "10px";
          statsDom.style.left = "10px";
          break;
        case "bottom-right":
          statsDom.style.bottom = "10px";
          statsDom.style.right = "10px";
          break;
      }
    }

    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (stats.dom && stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
    };
  }, [enabled, position, showMemory, showRenderTime]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: -1000,
        width: 100,
        maxWidth: 100,
        minWidth: 100,
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    />
  );
}; 