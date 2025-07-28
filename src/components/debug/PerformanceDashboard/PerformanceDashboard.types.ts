import type { WebGLRenderer } from 'three';

export interface PerformanceDashboardProps {
  renderer: WebGLRenderer | null;
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showAdvanced?: boolean;
  onPerformanceWarning?: (message: string) => void;
  className?: string;
}

export interface PerformanceContentProps {
  renderer: WebGLRenderer | null;
  enabled?: boolean;
  showAdvanced?: boolean;
  onPerformanceWarning?: (message: string) => void;
  className?: string;
} 