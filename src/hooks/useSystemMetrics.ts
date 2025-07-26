import { useState, useEffect } from 'react';

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  timestamp: number;
}

export const useSystemMetrics = (enabled: boolean = true, updateInterval: number = 2000) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    memory: { used: 0, total: 0, percentage: 0 },
    cpu: { usage: 0, cores: 0 },
    timestamp: Date.now()
  });

  useEffect(() => {
    if (!enabled) return;

    const updateMetrics = () => {
      // Simular métricas del sistema (en un entorno real usarías APIs del navegador o del sistema)
      const now = Date.now();
      
      // Simular uso de memoria (basado en performance.memory si está disponible)
      let memoryUsed = 0;
      let memoryTotal = 0;
      
      if ('memory' in performance) {
        const mem = (performance as Performance & { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        memoryUsed = mem.usedJSHeapSize;
        memoryTotal = mem.jsHeapSizeLimit;
      } else {
        // Fallback: simular valores
        memoryUsed = Math.random() * 100 * 1024 * 1024; // 0-100MB
        memoryTotal = 512 * 1024 * 1024; // 512MB
      }

      // Simular uso de CPU (en un entorno real necesitarías APIs específicas)
      const cpuUsage = Math.random() * 100; // 0-100%
      
      setMetrics({
        memory: {
          used: memoryUsed,
          total: memoryTotal,
          percentage: (memoryUsed / memoryTotal) * 100
        },
        cpu: {
          usage: cpuUsage,
          cores: navigator.hardwareConcurrency || 4
        },
        timestamp: now
      });
    };

    // Actualizar inmediatamente
    updateMetrics();

    // Configurar intervalo
    const interval = setInterval(updateMetrics, updateInterval);

    return () => clearInterval(interval);
  }, [enabled, updateInterval]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getMemoryColor = (percentage: number): string => {
    if (percentage < 50) return '#4CAF50'; // Verde
    if (percentage < 80) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  const getCpuColor = (usage: number): string => {
    if (usage < 50) return '#4CAF50'; // Verde
    if (usage < 80) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  return {
    metrics,
    formatBytes,
    getMemoryColor,
    getCpuColor
  };
}; 