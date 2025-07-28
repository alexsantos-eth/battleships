import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import type { SystemMetricsProps, ProgressBarProps } from './SystemMetrics.types';

export const SystemMetrics: React.FC<SystemMetricsProps> = ({
  enabled = true,
  showDetails = false,
  showCpu = false,
  className = '',
}) => {
  const { metrics, formatBytes, getMemoryColor, getCpuColor } =
    useSystemMetrics(enabled, 2000, showCpu);

  if (!enabled) return null;

  const ProgressBar: React.FC<ProgressBarProps> = ({
    percentage,
    color,
    label,
    value,
    unit = "%",
  }) => (
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
          fontSize: "10px",
        }}
      >
        <span>{label}</span>
        <span style={{ color }}>
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      className={className}
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "12px",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontSize: "11px",
        minWidth: "180px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          paddingBottom: "8px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>💻 System</span>
        <span style={{ fontSize: "9px", opacity: 0.7 }}>
          {metrics.cpu.cores} cores
        </span>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span>🖥️ CPU</span>
          <span style={{ color: getCpuColor(metrics.cpu.usage) }}>
            {metrics.cpu.usage.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          percentage={metrics.cpu.usage}
          color={getCpuColor(metrics.cpu.usage)}
          label=""
          value={metrics.cpu.usage}
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span>💾 RAM</span>
          <span style={{ color: getMemoryColor(metrics.memory.percentage) }}>
            {metrics.memory.percentage.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          percentage={metrics.memory.percentage}
          color={getMemoryColor(metrics.memory.percentage)}
          label=""
          value={metrics.memory.percentage}
        />
      </div>

      {showDetails && (
        <div
          style={{
            marginTop: "10px",
            paddingTop: "8px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "9px",
            opacity: 0.8,
          }}
        >
          <div>Used: {formatBytes(metrics.memory.used)}</div>
          <div>Total: {formatBytes(metrics.memory.total)}</div>
          <div>
            Available: {formatBytes(metrics.memory.total - metrics.memory.used)}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          fontSize: "9px",
        }}
      >
        <span
          style={{
            color: getCpuColor(metrics.cpu.usage),
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {metrics.cpu.usage > 80 ? "🔴" : metrics.cpu.usage > 50 ? "🟡" : "🟢"}{" "}
          CPU
        </span>
        <span
          style={{
            color: getMemoryColor(metrics.memory.percentage),
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {metrics.memory.percentage > 80
            ? "🔴"
            : metrics.memory.percentage > 50
            ? "🟡"
            : "🟢"}{" "}
          RAM
        </span>
      </div>
    </div>
  );
}; 