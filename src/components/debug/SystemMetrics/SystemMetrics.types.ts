export interface SystemMetricsProps {
  enabled?: boolean;
  showDetails?: boolean;
  showCpu?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  percentage: number;
  color: string;
  label: string;
  value: number;
  unit?: string;
} 