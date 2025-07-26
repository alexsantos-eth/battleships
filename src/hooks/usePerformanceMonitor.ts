import { useEffect, useRef, useCallback } from "react";
import Stats from "stats.js";
import type { WebGLRenderer } from "three";
import { DEBUG_CONFIG } from "@/utils/debug";

interface PerformanceMonitorOptions {
  enabled?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showMemory?: boolean;
  showRenderTime?: boolean;
  targetFPS?: number;
  onPerformanceWarning?: (message: string) => void;
}

interface PerformanceMetrics {
  fps: number;
  memory: {
    geometries: number;
    textures: number;
    triangles: number;
  };
  renderTime: number;
  isLowPerformance: boolean;
}

export const usePerformanceMonitor = (
  renderer: WebGLRenderer | null,
  options: PerformanceMonitorOptions = {}
) => {
  const {
    enabled = DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR,
    position = DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION,
    showMemory = true,
    showRenderTime = true,
    targetFPS = DEBUG_CONFIG.TARGET_FPS,
    onPerformanceWarning,
  } = options;

  const statsRef = useRef<Stats | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 0,
    memory: { geometries: 0, textures: 0, triangles: 0 },
    renderTime: 0,
    isLowPerformance: false,
  });

  const initializeStats = useCallback(() => {
    if (!enabled || !containerRef.current) return;

    const stats = new Stats();
    statsRef.current = stats;

    // Position the stats panel
    const container = containerRef.current;
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
  }, [enabled, position, showMemory, showRenderTime]);

  const cleanupStats = useCallback(() => {
    if (statsRef.current?.dom && statsRef.current.dom.parentNode) {
      statsRef.current.dom.parentNode.removeChild(statsRef.current.dom);
    }
    statsRef.current = null;
  }, []);

  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    if (!statsRef.current) return metricsRef.current;

    // For now, return basic metrics without parsing DOM
    // This avoids issues with DOM access and textContent parsing
    const fps = 60; // Default value, can be enhanced later
    const renderTime = 16; // Default ~60fps

    // Get Three.js memory info if renderer is available
    let memory = { geometries: 0, textures: 0, triangles: 0 };
    if (renderer) {
      const info = renderer.info;
      memory = {
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        triangles: info.render.triangles,
      };
    }

    const isLowPerformance = fps < targetFPS * 0.8; // Warning if FPS drops below 80% of target

    const metrics: PerformanceMetrics = {
      fps,
      memory,
      renderTime,
      isLowPerformance,
    };

    metricsRef.current = metrics;

    // Trigger performance warning if needed
    if (isLowPerformance && onPerformanceWarning) {
      onPerformanceWarning(
        `Low performance detected: ${fps} FPS (target: ${targetFPS})`
      );
    }

    return metrics;
  }, [renderer, targetFPS, onPerformanceWarning]);

  const beginMeasure = useCallback(() => {
    if (statsRef.current) {
      statsRef.current.begin();
    }
  }, []);

  const endMeasure = useCallback(() => {
    if (statsRef.current) {
      statsRef.current.end();
    }
  }, []);

  const setContainer = useCallback(
    (container: HTMLDivElement | null) => {
      containerRef.current = container;
      if (container && enabled) {
        initializeStats();
      } else {
        cleanupStats();
      }
    },
    [enabled, initializeStats, cleanupStats]
  );

  useEffect(() => {
    if (enabled && containerRef.current) {
      initializeStats();
    } else {
      cleanupStats();
    }

    return cleanupStats;
  }, [enabled, initializeStats, cleanupStats]);

  return {
    setContainer,
    getPerformanceMetrics,
    beginMeasure,
    endMeasure,
    isEnabled: enabled,
    stats: statsRef.current,
  };
};
