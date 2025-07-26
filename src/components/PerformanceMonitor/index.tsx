import { useEffect, useRef } from "react";
import Stats from "stats.js";

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showMemory?: boolean;
  showRenderTime?: boolean;
}

export const PerformanceMonitor = ({
  enabled = true,
  position = "top-left",
  showMemory = true,
  showRenderTime = true,
}: PerformanceMonitorProps) => {
  const statsRef = useRef<Stats | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const stats = new Stats();
    statsRef.current = stats;

    // Configure stats display
    stats.showPanel(0); // FPS panel
    if (showMemory) stats.showPanel(1); // Memory panel
    if (showRenderTime) stats.showPanel(2); // Render time panel

    // Position the stats panel
    const container = containerRef.current;
    if (container) {
      container.appendChild(stats.dom);

      // Apply positioning styles
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

    // Animation loop for stats
    const animate = () => {
      stats.begin();

      // Simulate render time measurement
      // In a real app, this would be your actual render loop
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

export default PerformanceMonitor;
