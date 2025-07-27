export interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showMemory?: boolean;
  showRenderTime?: boolean;
  className?: string;
} 